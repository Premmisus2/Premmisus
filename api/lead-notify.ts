// Vercel serverless — Premmisus lead notification pipeline
// Fires on every website form submission (Qualifier + Contact)
// Direct API calls — no middleman, no n8n, Premmisus owns this
//
// What it does:
// 1. Logs lead to Google Sheets
// 2. Emails Elliott (elliott@premmisus.com)
// 3. Auto-replies to the prospect with booking link
// 4. Pings Elliott on Telegram
// 5. Texts Elliott's phone via Twilio

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { formData, answers, source } = req.body;

  if (!formData?.name || !formData?.email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const nameParts = formData.name.trim().split(' ');
  const firstName = nameParts[0];
  const email = formData.email;
  const phone = formData.phone || '';
  const businessName = formData.businessName || '';
  const industry = answers?.['Which industry describes you best?'] ?? '';
  const revenue = answers?.['What is your current monthly revenue?'] ?? '';
  const bottleneck = answers?.['What is your primary bottleneck?'] ?? '';
  const message = answers?.message ?? '';
  const leadSource = source || 'Website';
  const date = new Date().toISOString().split('T')[0];

  const accessToken = await getGoogleAccessToken();

  const results = await Promise.allSettled([
    // 1. Google Sheets — log the lead
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1!A:K:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[date, formData.name, email, phone, businessName, industry, revenue, bottleneck, leadSource, message, 'New']],
      }),
    }),

    // 2. Gmail — notify Elliott
    sendGmail(
      accessToken,
      'elliott@premmisus.com',
      `🔥 New Lead: ${businessName || formData.name} (${industry || leadSource})`,
      `<h2 style="margin:0 0 16px">New Lead from premmisus.ca</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Contact</td><td style="padding:8px;border-bottom:1px solid #eee">${formData.name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Email</td><td style="padding:8px;border-bottom:1px solid #eee">${email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Phone</td><td style="padding:8px;border-bottom:1px solid #eee">${phone}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Business</td><td style="padding:8px;border-bottom:1px solid #eee">${businessName}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Industry</td><td style="padding:8px;border-bottom:1px solid #eee">${industry}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Revenue</td><td style="padding:8px;border-bottom:1px solid #eee">${revenue}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Bottleneck</td><td style="padding:8px;border-bottom:1px solid #eee">${bottleneck}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Source</td><td style="padding:8px;border-bottom:1px solid #eee">${leadSource}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${message}</td></tr>
      </table>`
    ),

    // 3. Gmail — auto-reply to the prospect
    sendGmail(
      accessToken,
      email,
      'Thanks for reaching out — Premmisus',
      `Hey ${firstName},\n\nThanks for reaching out. I'll review your info and get back to you within 24 hours.\n\nIf you want to book a quick call right away, here's my calendar:\nhttps://api.leadconnectorhq.com/widget/booking/UgbkluKHfhueTcf7vlfT\n\nTalk soon,\nElliott\nPremmisus | Marketing & AI for Canadian Businesses\npremmisus.ca`,
      'text'
    ),

    // 4. Telegram — ping Elliott
    fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: '8587576007',
        text: `🔥 New Lead\n\nName: ${formData.name}\nBusiness: ${businessName}\nPhone: ${phone}\nEmail: ${email}\nIndustry: ${industry}\nRevenue: ${revenue}\nSource: ${leadSource}`,
      }),
    }),

    // 5. Twilio SMS — text Elliott's phone
    fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: '+12494682807',
        To: '+12509867747',
        Body: `🔥 New Lead — ${formData.name} (${businessName || industry || 'Website'}). Phone: ${phone}. Check email for details.`,
      }).toString(),
    }),
  ]);

  // Log any failures
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`Lead notify step ${i} failed:`, result.reason);
    }
  });

  return res.status(200).json({ success: true });
}

// --- Google OAuth: service account JWT → access token ---

async function getGoogleAccessToken(): Promise<string> {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const claimSet = btoa(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/gmail.send',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
    sub: 'elliott@premmisus.com',
  }));

  const signInput = `${header}.${claimSet}`;
  const cryptoKey = await importPKCS8(key.private_key);
  const signature = await sign(cryptoKey, signInput);

  const jwt = `${signInput}.${signature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant_type:jwt-bearer',
      assertion: jwt,
    }).toString(),
  });

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

async function importPKCS8(pem: string): Promise<CryptoKey> {
  const pemContents = pem.replace(/-----BEGIN PRIVATE KEY-----/g, '').replace(/-----END PRIVATE KEY-----/g, '').replace(/\n/g, '');
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  return crypto.subtle.importKey('pkcs8', binaryDer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
}

async function sign(key: CryptoKey, data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoded);
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// --- Gmail: send via API ---

async function sendGmail(accessToken: string, to: string, subject: string, body: string, type: 'html' | 'text' = 'html') {
  const mimeType = type === 'html' ? 'text/html' : 'text/plain';
  const raw = btoa(
    `From: elliott@premmisus.com\r\nTo: ${to}\r\nSubject: ${subject}\r\nContent-Type: ${mimeType}; charset=UTF-8\r\n\r\n${body}`
  ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });
}
