import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;
const toEmail = process.env.RESEND_TO_EMAIL;

const resend = new Resend(resendApiKey);

export default async (req, res) => {
  if (!resendApiKey || !fromEmail || !toEmail) {
    console.error('One or more Resend environment variables are not set.');
    return res.status(500).json({ error: 'Internal Server Error: Missing server configuration.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(422).json({ error: 'Name, email, and message are required' });
    }

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Yeni İletişim Formu Mesajı from ${name}`,
      reply_to: email,
      html: `<p><strong>Gönderen:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mesaj:</strong></p>
             <p>${message}</p>`,
    });

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}; 