import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const myEmail = process.env.MY_EMAIL_ADDRESS;

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    await resend.emails.send({
      from: 'onboarding@resend.dev', // Bu, Resend'in varsayılan gönderim adresidir.
      to: myEmail,
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