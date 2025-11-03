
// Fix: Import nodemailer correctly for Next.js 16 + Turbopack
import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName: string
) {
  console.log('\n📧 === SENDING PASSWORD RESET EMAIL ===');
  console.log('To:', email);
  console.log('User:', userName);
  console.log('Token (first 10 chars):', resetToken.substring(0, 10) + '...');

  // Check environment variables
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET');
  console.log('APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ SMTP credentials not configured!');
    return {
      success: false,
      error: 'Email service not configured'
    };
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  console.log('🔗 Reset URL:', resetUrl);

  // Fix: Use nodemailer.createTransport (not createTransporter)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Minterviewer" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your Password - Minterviewer',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: #2563eb; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 40px 30px; }
            .content p { margin: 0 0 15px; font-size: 16px; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { 
              display: inline-block; 
              background: #2563eb; 
              color: white !important; 
              padding: 14px 40px; 
              text-decoration: none; 
              border-radius: 6px; 
              font-weight: bold;
              font-size: 16px;
            }
            .warning-box { 
              background: #fef2f2; 
              border-left: 4px solid #dc2626; 
              padding: 15px; 
              margin: 25px 0; 
            }
            .footer { 
              background: #f9fafb; 
              padding: 20px; 
              text-align: center; 
              color: #6b7280; 
              font-size: 13px; 
            }
            .link-text { 
              word-break: break-all; 
              color: #2563eb; 
              font-size: 14px; 
              margin-top: 20px; 
              padding: 10px; 
              background: #f3f4f6; 
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>We received a request to reset your password for your Minterviewer account.</p>
              
              <div class="button-container">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <p style="text-align: center; color: #6b7280; font-size: 14px;">Or copy this link:</p>
              <div class="link-text">${resetUrl}</div>
              
              <div class="warning-box">
                <p><strong>⚠️ Important:</strong></p>
                <p>• This link expires in 1 hour</p>
                <p>• If you didn't request this, ignore this email</p>
                <p>• Your password remains unchanged until you use this link</p>
              </div>
            </div>
            <div class="footer">
              <p><strong>Minterviewer</strong></p>
              <p>© 2025 All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${userName},

We received a request to reset your password.

Click here to reset: ${resetUrl}

This link expires in 1 hour.
If you didn't request this, ignore this email.

© 2025 Minterviewer
    `,
  };

  try {
    console.log('📤 Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Accepted:', info.accepted);
    console.log('📧 Rejected:', info.rejected);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error('❌ FAILED TO SEND EMAIL!');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Full error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}