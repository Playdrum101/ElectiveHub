import nodemailer from "nodemailer";

// Create transporter (configure with your SMTP settings)
const createTransporter = () => {
  // For development, use environment variables
  // For production, use a service like SendGrid, Resend, or Gmail
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: Use a test account (won't actually send emails)
  // In production, always configure real SMTP settings
  return nodemailer.createTransporter({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "test@example.com",
      pass: "test",
    },
  });
};

export async function sendWaitlistPromotionEmail(
  userEmail: string,
  userName: string,
  courseTitle: string,
  courseCode: string,
  registrationId: string
) {
  const transporter = createTransporter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const acceptUrl = `${baseUrl}/waitlist/accept/${registrationId}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || "ElectiveHub <noreply@electivehub.com>",
    to: userEmail,
    subject: `🎓 Action Required: Your Waitlist Spot is Ready! - ${courseCode}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Your Waitlist Spot is Ready!</h1>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              
              <p>Great news! A spot has opened up in the course you were waitlisted for:</p>
              
              <h2>${courseCode} - ${courseTitle}</h2>
              
              <div class="warning">
                <strong>⏰ Action Required:</strong> You have <strong>24 hours</strong> to confirm your enrollment. 
                If you don't respond in time, your spot will be offered to the next person on the waitlist.
              </div>
              
              <p>Click the button below to accept your spot:</p>
              
              <a href="${acceptUrl}" class="button">Accept My Spot</a>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${acceptUrl}</p>
              
              <p>If you're no longer interested, you can simply ignore this email and your spot will be offered to the next person.</p>
              
              <p>Best regards,<br>The ElectiveHub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Your Waitlist Spot is Ready!
      
      Hello ${userName},
      
      Great news! A spot has opened up in ${courseCode} - ${courseTitle}.
      
      Action Required: You have 24 hours to confirm your enrollment.
      
      Accept your spot: ${acceptUrl}
      
      If you don't respond in time, your spot will be offered to the next person on the waitlist.
      
      Best regards,
      The ElectiveHub Team
    `,
  };

  try {
    // Only send if SMTP is properly configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.messageId);
      return { success: true, messageId: info.messageId };
    } else {
      console.log("SMTP not configured. Email would be sent to:", userEmail);
      console.log("Accept URL:", acceptUrl);
      return { success: true, messageId: "simulated" };
    }
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

export async function sendRegistrationConfirmationEmail(
  userEmail: string,
  userName: string,
  courseTitle: string,
  courseCode: string
) {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || "ElectiveHub <noreply@electivehub.com>",
    to: userEmail,
    subject: `✅ Enrollment Confirmed - ${courseCode}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Enrollment Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              
              <div class="success">
                <strong>Congratulations!</strong> You have successfully enrolled in:
                <h2>${courseCode} - ${courseTitle}</h2>
              </div>
              
              <p>You can view your enrolled courses in your dashboard.</p>
              
              <p>Best regards,<br>The ElectiveHub Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } else {
      console.log("SMTP not configured. Email would be sent to:", userEmail);
      return { success: true };
    }
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

