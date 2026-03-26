// Vercel serverless proxy — fires GHL webhook with form data
// GHL workflow handles: contact creation, opportunity, SMS, email, internal notifications

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/ugg4v4G1WJMtqGcWFUp5/webhook-trigger/9ARVupAhdYfb5uAaSgdZ';

  const { formData, answers, source, turnstileToken } = req.body;

  if (!formData?.name || !formData?.email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Verify Cloudflare Turnstile token
  if (turnstileToken) {
    try {
      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      });
      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        return res.status(403).json({ error: 'Bot verification failed' });
      }
    } catch (err) {
      console.error('Turnstile verification error:', err);
    }
  }

  const nameParts = formData.name.trim().split(' ');

  try {
    const webhookRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone || '',
        companyName: formData.businessName || '',
        source: source || 'Website',
        industry: answers?.['Which industry describes you best?'] ?? '',
        revenue: answers?.['What is your current monthly revenue?'] ?? '',
        bottleneck: answers?.['What is your primary bottleneck?'] ?? '',
      }),
    });

    if (!webhookRes.ok) {
      const errText = await webhookRes.text();
      console.error('GHL webhook failed:', webhookRes.status, errText);
      return res.status(502).json({ error: 'Webhook failed', details: errText });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('GHL proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
