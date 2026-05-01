import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = path.join(__dirname, '../../.tokens.json');

export interface Tokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  id_token?: string;
  obtained_at: number;
}

export async function saveTokens(tokens: Omit<Tokens, 'obtained_at'>): Promise<void> {
  const tokensWithTimestamp: Tokens = {
    ...tokens,
    obtained_at: Date.now(),
  };
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokensWithTimestamp, null, 2));
}

export async function loadTokens(): Promise<Tokens | null> {
  try {
    const data = await fs.readFile(TOKEN_PATH, 'utf-8');
    return JSON.parse(data) as Tokens;
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(tokens: Tokens): boolean {
  const expirationTime = tokens.obtained_at + tokens.expires_in * 1000;
  // Buffer of 5 minutes
  return Date.now() > expirationTime - 5 * 60 * 1000;
}
