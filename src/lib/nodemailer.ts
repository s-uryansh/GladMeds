import nodemailer from 'nodemailer';

export async function sendPasswordEmail(email: string, password: string, name: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Your GladMeds Account Password',
      html: `
        <h2>Welcome to GladMeds</h2>
        <p>Dear ${name},</p>
        <p>Your account has been created successfully. Here are your login credentials:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please keep this password safe and consider changing it after your first login.</p>
        <br>
        <p>Best regards,<br>GladMeds Team</p>
      `,
    });

    console.log(`Password email sent successfully to ${email}`);
  } catch (error) {
    console.error('Failed to send password email:', error);
    // Don't throw the error to prevent signup failure if email fails
  }
}