import { connectIMAP } from '../lib/imap.js';
import { simpleParser } from 'mailparser';

export interface SearchOptions {
  query?: string;
  from?: string;
  subject?: string;
  since?: string;
  limit?: number;
}

export const searchEmails = async (options: SearchOptions) => {
  const connection = await connectIMAP();
  
  try {
    await connection.openBox('INBOX');
    
    const searchCriteria: any[] = ['ALL'];
    
    if (options.from) {
      searchCriteria.push(['FROM', options.from]);
    }
    
    if (options.subject) {
      searchCriteria.push(['SUBJECT', options.subject]);
    }
    
    if (options.query) {
      searchCriteria.push(['TEXT', options.query]);
    }

    if (options.since) {
      searchCriteria.push(['SINCE', options.since]);
    }

    const fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
      struct: true
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    
    // Sort by UID descending
    messages.sort((a, b) => b.attributes.uid - a.attributes.uid);
    
    const limitedMessages = messages.slice(0, options.limit || 10);
    
    const results = await Promise.all(limitedMessages.map(async (item) => {
      const all = item.parts.find(part => part.which === '');
      const id = item.attributes.uid;
      
      if (!all) return { id, error: 'Could not fetch message body' };

      const parsed = await simpleParser(all.body);
      
      return {
        id,
        from: parsed.from?.text,
        subject: parsed.subject,
        date: parsed.date,
        snippet: parsed.text ? parsed.text.substring(0, 200).replace(/\s+/g, ' ') + '...' : ''
      };
    }));

    return results;
  } finally {
    connection.end();
  }
};
