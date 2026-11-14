/**
 * Vercel Serverless Function: WhatsApp Relay Endpoint
 * Relays website chat inquiries to the store owner's WhatsApp WITHOUT
 * ever exposing the owner's phone number to the client browser.
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { clientName, clientContact, message, category } = req.body || {};

    if (!clientName || !clientContact || !message) {
      return res.status(400).json({
        error: 'Missing required inquiry parameters: clientName, clientContact, and message.',
      });
    }

    const adminWhatsApp = process.env.ADMIN_WHATSAPP_NUMBER;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
    const metaToken = process.env.META_WHATSAPP_TOKEN;
    const metaPhoneId = process.env.META_PHONE_NUMBER_ID;
    const customWebhook = process.env.WHATSAPP_WEBHOOK_URL;

    const formattedPayload = {
      timestamp: new Date().toISOString(),
      source: 'Abhi Furniture Mall — Online Concierge',
      category: category || 'General Inquiry',
      clientName: clientName.trim(),
      clientContact: clientContact.trim(),
      message: message.trim(),
    };

    console.log('[WhatsApp Relay] Received inquiry:', formattedPayload);

    // Option A: Custom Webhook (Wati, Aisensy, Make, Zapier, etc.)
    if (customWebhook) {
      try {
        await fetch(customWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedPayload),
        });
        console.log('[WhatsApp Relay] Successfully forwarded to custom webhook.');
      } catch (err) {
        console.error('[WhatsApp Relay] Webhook forward error:', err);
      }
    }

    // Option B: Official Meta WhatsApp Cloud API
    if (metaToken && metaPhoneId && adminWhatsApp) {
      try {
        const metaUrl = `https://graph.facebook.com/v19.0/${metaPhoneId}/messages`;
        await fetch(metaUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${metaToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: adminWhatsApp.replace(/[^0-9]/g, ''),
            type: 'text',
            text: {
              body: `📩 *New Website Inquiry — Abhi Furniture Mall*\n\n*Client:* ${clientName}\n*Contact:* ${clientContact}\n*Category:* ${category || 'General'}\n*Message:* ${message}`,
            },
          }),
        });
        console.log('[WhatsApp Relay] Forwarded via Meta Cloud API.');
      } catch (err) {
        console.error('[WhatsApp Relay] Meta API error:', err);
      }
    }

    // Option C: Twilio WhatsApp API
    if (twilioSid && twilioToken && adminWhatsApp) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
        const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const formParams = new URLSearchParams();
        formParams.append('From', twilioFrom);
        formParams.append('To', `whatsapp:${adminWhatsApp.replace(/[^0-9+]/g, '')}`);
        formParams.append(
          'Body',
          `📩 *New Website Inquiry — Abhi Furniture Mall*\n\n*Client:* ${clientName}\n*Contact:* ${clientContact}\n*Category:* ${category || 'General'}\n*Message:* ${message}`
        );

        await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formParams.toString(),
        });
        console.log('[WhatsApp Relay] Forwarded via Twilio.');
      } catch (err) {
        console.error('[WhatsApp Relay] Twilio error:', err);
      }
    }

    // Return clean response to visitor (NEVER revealing the admin phone number)
    return res.status(200).json({
      success: true,
      message: 'Inquiry dispatched to Showroom WhatsApp Desk.',
      timestamp: formattedPayload.timestamp,
    });
  } catch (error) {
    console.error('[WhatsApp Relay] Unexpected error:', error);
    return res.status(500).json({
      error: 'Failed to process inquiry relay.',
    });
  }
}

