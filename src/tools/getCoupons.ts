import { searchEmails } from './searchEmails.js';
import { readEmailContent } from './readEmailContent.js';

export const getCoupons = async (limit: number = 5) => {
  const emails = await searchEmails({ query: 'coupons', limit });
  
  const results = await Promise.all(emails.map(async (email) => {
    if ('error' in email) return { subject: 'Error', error: email.error };
    
    const content = await readEmailContent(email.id);
    if ('error' in content) return { subject: email.subject, error: content.error };

    let text = '';
    if (content.body) {
      text = content.body;
    } else if (content.html) {
      // Remove style and script tags and their content
      const cleanHtml = content.html.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, '');
      text = cleanHtml.replace(/<[^>]*>?/gm, ' ');
    }

    const codes = (text.match(/([A-Z0-9]{5,20})/g) || [])
      .filter(c => /[A-Z]/.test(c) && /[0-9]/.test(c));

    return {
      id: email.id,
      from: email.from,
      subject: email.subject,
      codes: Array.from(new Set(codes)) // De-duplicate
    };
  }));

  return results;
};
