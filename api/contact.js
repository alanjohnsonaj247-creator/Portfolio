const nodemailer = require('nodemailer');

// Load env variables if running locally
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (err) {
    console.warn('dotenv module not loaded, using system env variables.');
  }
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Simple validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Verify SMTP variables are set
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials are not configured in environment variables.');
    return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const dateString = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const encodedSubject = encodeURIComponent(`Re: ${subject}`);

  try {
    // Send mail
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`, // Send on behalf of user via SMTP user authentication
      to: process.env.CONTACT_RECIPIENT || process.env.SMTP_USER, // Send to configured recipient, or fallback to sender
      replyTo: email, // Direct replies to user's email
      subject: `Portfolio Contact: ${subject}`,
      text: `You have received a new message from your portfolio contact form.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`,
      html: `
        <div style="background-color: #FCF8F2; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E3D3C4; overflow: hidden; box-shadow: 0 10px 30px rgba(22, 33, 62, 0.05);">
            <!-- Top Accent Bar -->
            <div style="height: 6px; background-color: #275CCC;"></div>
            
            <div style="padding: 40px 30px;">
              <!-- Header -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #275CCC; font-weight: 700; display: block; margin-bottom: 4px;">Inbound Message</span>
                    <h1 style="font-size: 22px; font-weight: 700; color: #16213E; margin: 0; letter-spacing: -0.01em;">New Portfolio Inquiry</h1>
                  </td>
                  <td style="text-align: right; vertical-align: bottom;">
                    <span style="font-size: 13px; color: #64748B;">${dateString}</span>
                  </td>
                </tr>
              </table>
              
              <!-- Divider -->
              <hr style="border: 0; border-top: 1px solid #E3D3C4; margin: 0 0 25px 0;" />
              
              <!-- Details Table -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; line-height: 1.5;">
                <tr>
                  <td style="padding: 10px 0; width: 90px; color: #64748B; font-weight: 500; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; vertical-align: top; border-bottom: 1px solid #FCF6EB;">Name</td>
                  <td style="padding: 10px 0; color: #16213E; font-weight: 600; vertical-align: top; border-bottom: 1px solid #FCF6EB;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748B; font-weight: 500; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; vertical-align: top; border-bottom: 1px solid #FCF6EB;">Email</td>
                  <td style="padding: 10px 0; color: #16213E; font-weight: 600; vertical-align: top; border-bottom: 1px solid #FCF6EB;">
                    <a href="mailto:${email}" style="color: #275CCC; text-decoration: none; border-bottom: 1px dashed #275CCC;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748B; font-weight: 500; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; vertical-align: top; border-bottom: 1px solid #FCF6EB;">Subject</td>
                  <td style="padding: 10px 0; color: #16213E; font-weight: 600; vertical-align: top; border-bottom: 1px solid #FCF6EB;">${subject}</td>
                </tr>
              </table>
              
              <!-- Message Section -->
              <div style="margin-bottom: 35px;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748B; font-weight: 700; display: block; margin-bottom: 10px;">Message Content</span>
                <div style="background-color: #FCF6EB; border-left: 4px solid #275CCC; border-radius: 4px; padding: 20px 24px; color: #16213E; font-size: 15px; line-height: 1.6; white-space: pre-wrap; font-style: italic;">"${message}"</div>
              </div>
              
              <!-- Action Button -->
              <div style="text-align: center;">
                <a href="mailto:${email}?subject=${encodedSubject}" style="display: inline-block; background-color: #275CCC; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(39, 92, 204, 0.15);">
                  Reply Direct to Sender
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #FCF6EB; padding: 24px 30px; border-top: 1px solid #E3D3C4; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748B; line-height: 1.5; font-weight: 500;">
                This message was sent via the contact form on your portfolio website.<br />
                <span style="font-weight: 700; color: #16213E; display: inline-block; margin-top: 5px;">Alan Johnson | Software Developer</span>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};
