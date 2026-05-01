import axios from 'axios';
import open from 'open';
import readline from 'node:readline';
import { saveTokens, loadTokens, isTokenExpired, Tokens } from './tokenManager.js';
import dotenv from 'dotenv';

dotenv.config();

const YAHOO_AUTH_URL = 'https://api.login.yahoo.com/oauth2/request_auth';
const YAHOO_TOKEN_URL = 'https://api.login.yahoo.com/oauth2/get_token';

const CLIENT_ID = process.env.YAHOO_CLIENT_ID;
const CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET;
const REDIRECT_URI = process.env.YAHOO_REDIRECT_URI || 'https://localhost/callback';

export async function getAccessToken(): Promise<string> {
  let tokens = await loadTokens();

  if (!tokens) {
    tokens = await performFullOAuthFlow();
  } else if (isTokenExpired(tokens)) {
    tokens = await refreshAccessToken(tokens.refresh_token);
  }

  return tokens.access_token;
}

async function promptForCode(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Please enter the authorization code from the redirect URL: ', (code) => {
      rl.close();
      resolve(code.trim());
    });
  });
}

async function performFullOAuthFlow(): Promise<Tokens> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('YAHOO_CLIENT_ID and YAHOO_CLIENT_SECRET must be set in environment variables');
  }

  const authUrl = new URL(YAHOO_AUTH_URL);
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'mail-r mail-w');

  console.error('Opening browser for Yahoo authentication...');
  console.error('URL:', authUrl.toString());
  await open(authUrl.toString());

  console.error('\n1. Log in to Yahoo in the opened browser window.');
  console.error('2. After authorizing, you will be redirected to a URL (which might fail to load).');
  console.error('3. Copy the "code" parameter from that URL.');
  
  const code = await promptForCode();

  if (!code) {
    throw new Error('Authorization code is required');
  }

  console.error('Exchanging for tokens...');

  const response = await axios.post(
    YAHOO_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const tokens = response.data;
  await saveTokens(tokens);
  return tokens;
}

async function refreshAccessToken(refreshToken: string): Promise<Tokens> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('YAHOO_CLIENT_ID and YAHOO_CLIENT_SECRET must be set in environment variables');
  }

  console.error('Refreshing access token...');
  const response = await axios.post(
    YAHOO_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const tokens = response.data;
  await saveTokens(tokens);
  return tokens;
}
