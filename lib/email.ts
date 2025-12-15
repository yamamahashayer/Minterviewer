
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


export async function sendBookingConfirmationEmail(
  to: string,
  userName: string,
  sessionTitle: string,
  date: string,
  time: string,
  meetingLink: string,
  role: 'mentor' | 'mentee',
  startTimeIso: Date,
  durationMinutes: number
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ SMTP credentials not configured!');
    return { success: false, error: 'Email service not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = `Booking Confirmed: ${sessionTitle}`;
  const instructions = role === 'mentor'
    ? 'You have a new session booking. Please be ready at the scheduled time.'
    : 'Your session has been successfully booked. Please join using the link below at the scheduled time.';

  // --- Calendar Logic ---
  const start = new Date(startTimeIso);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  const formatAppsDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

  // Google Calendar Link
  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(sessionTitle)}&dates=${formatAppsDate(start)}/${formatAppsDate(end)}&details=${encodeURIComponent('Join Meeting: ' + meetingLink)}&location=${encodeURIComponent(meetingLink)}`;

  // ICS Content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Minterviewer//Booking//EN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:minterviewer-${start.getTime()}-${to.replace(/[^\w]/g, '')}`, // improved UID uniqueness
    `DTSTAMP:${formatAppsDate(new Date())}`,
    `DTSTART:${formatAppsDate(start)}`,
    `DTEND:${formatAppsDate(end)}`,
    `SUMMARY:${sessionTitle}`,
    `DESCRIPTION:Join Meeting: ${meetingLink}`,
    `LOCATION:${meetingLink}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          .detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .detail-label { font-weight: 600; color: #64748b; }
          .detail-value { font-weight: 500; color: #1e293b; color:black; } 
          .button-container { text-align: center; margin: 30px 0; display: flex; flex-direction: column; gap: 10px; align-items: center; }
          .button { display: inline-block; background: #7c3aed; color: white !important; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background 0.3s; min-width: 200px; }
          .button:hover { background: #6d28d9; }
          .button.secondary { background: #fff; color: #7c3aed !important; border: 2px solid #7c3aed; }
          .button.secondary:hover { background: #f3f4f6; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Booking Confirmed</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${userName}</strong>,</p>
            <p>${instructions}</p>
            
            <div class="details-box">
              <div class="detail-row">
                <span class="detail-label">Session</span>
                <span class="detail-value">${sessionTitle}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time</span>
                <span class="detail-value">${time}</span>
              </div>
            </div>

            <div class="button-container">
              <a href="${meetingLink}" class="button">Join Meeting</a>
              <a href="${gCalUrl}" class="button secondary">Add to Google Calendar</a>
              <p style="margin-top: 10px; font-size: 13px; color: #64748b;">
                <strong>Note:</strong> If asked, please log in with Google/Jitsi to start the meeting as a moderator.
              </p>
            </div>

            <p style="text-align: center; color: #6b7280; font-size: 14px;">Or copy this link:</p>
            <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; word-break: break-all; color: #4f46e5; text-align: center; font-family: monospace;">${meetingLink}</div>
          </div>
          <div class="footer">
            <p><strong>Minterviewer</strong></p>
            <p>Need to reschedule? cancel before an hour of the start time.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Minterviewer" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      icalEvent: {
        filename: 'invitation.ics',
        method: 'REQUEST',
        content: icsContent
      }
    });
    console.log(`✅ Booking email sent to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send booking email to ${to}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}