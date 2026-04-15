import dotenv from 'dotenv';
dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@codesphere.dev';

// Lazy-load Resend only when key is available
async function getResend() {
  if (!RESEND_API_KEY) return null;
  const { Resend } = await import('resend');
  return new Resend(RESEND_API_KEY);
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const resend = await getResend();
  if (!resend) {
    console.warn(`[Email] RESEND_API_KEY not set — would have sent "${subject}" to ${to}`);
    return false;
  }
  try {
    await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
    return true;
  } catch (err) {
    console.error('[Email] Send failed:', err);
    return false;
  }
}

// ── Email templates ────────────────────────────────────────────────────────

export function passwordResetEmail(firstName: string, resetUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:sans-serif;background:#0f0f0f;color:#e5e5e5;margin:0;padding:0">
  <div style="max-width:520px;margin:40px auto;background:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #2d2d4e">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700">CodeSphere</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">The Ultimate Student Learning Platform</p>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 16px;color:#e5e5e5;font-size:20px">Reset your password</h2>
      <p style="margin:0 0 24px;color:#a0a0b0;line-height:1.6">
        Hi ${firstName}, we received a request to reset your password. Click the button below to create a new one.
        This link expires in <strong style="color:#e5e5e5">1 hour</strong>.
      </p>
      <div style="text-align:center;margin:32px 0">
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">
          Reset Password
        </a>
      </div>
      <p style="margin:24px 0 0;color:#6b6b80;font-size:13px;line-height:1.6">
        If you didn't request this, you can safely ignore this email. Your password won't change.
      </p>
      <p style="margin:8px 0 0;color:#6b6b80;font-size:12px">
        Or copy this link: <a href="${resetUrl}" style="color:#6366f1">${resetUrl}</a>
      </p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #2d2d4e;text-align:center">
      <p style="margin:0;color:#6b6b80;font-size:12px">© ${new Date().getFullYear()} CodeSphere. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export function emailVerificationEmail(firstName: string, verifyUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:sans-serif;background:#0f0f0f;color:#e5e5e5;margin:0;padding:0">
  <div style="max-width:520px;margin:40px auto;background:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #2d2d4e">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700">CodeSphere</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">The Ultimate Student Learning Platform</p>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 16px;color:#e5e5e5;font-size:20px">Verify your email</h2>
      <p style="margin:0 0 24px;color:#a0a0b0;line-height:1.6">
        Hi ${firstName}, welcome to CodeSphere! Please verify your email address to unlock all features.
        This link expires in <strong style="color:#e5e5e5">24 hours</strong>.
      </p>
      <div style="text-align:center;margin:32px 0">
        <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">
          Verify Email
        </a>
      </div>
      <p style="margin:24px 0 0;color:#6b6b80;font-size:12px">
        Or copy this link: <a href="${verifyUrl}" style="color:#6366f1">${verifyUrl}</a>
      </p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #2d2d4e;text-align:center">
      <p style="margin:0;color:#6b6b80;font-size:12px">© ${new Date().getFullYear()} CodeSphere. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export function otpVerificationEmail(firstName: string, otp: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:sans-serif;background:#0f0f0f;color:#e5e5e5;margin:0;padding:0">
  <div style="max-width:520px;margin:40px auto;background:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #2d2d4e">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700">CodeSphere</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">The Ultimate Student Learning Platform</p>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 16px;color:#e5e5e5;font-size:20px">Verify your email</h2>
      <p style="margin:0 0 24px;color:#a0a0b0;line-height:1.6">
        Hi ${firstName}, use the verification code below to confirm your email address.
        This code expires in <strong style="color:#e5e5e5">10 minutes</strong>.
      </p>
      <div style="text-align:center;margin:32px 0">
        <div style="display:inline-block;background:#0f0f1a;border:2px solid #6366f1;border-radius:12px;padding:20px 40px;letter-spacing:12px;font-size:36px;font-weight:800;color:#fff;font-family:monospace">
          ${otp}
        </div>
      </div>
      <p style="margin:24px 0 0;color:#6b6b80;font-size:13px;line-height:1.6">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #2d2d4e;text-align:center">
      <p style="margin:0;color:#6b6b80;font-size:12px">© ${new Date().getFullYear()} CodeSphere. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export function welcomeEmail(firstName: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#0f0f0f;color:#e5e5e5;margin:0;padding:0">
  <div style="max-width:520px;margin:40px auto;background:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #2d2d4e">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700">Welcome to CodeSphere! 🚀</h1>
    </div>
    <div style="padding:32px">
      <p style="margin:0 0 16px;color:#a0a0b0;line-height:1.6">Hi ${firstName},</p>
      <p style="margin:0 0 16px;color:#a0a0b0;line-height:1.6">
        You're now part of the CodeSphere community. Here's what you can do:
      </p>
      <ul style="color:#a0a0b0;line-height:2;padding-left:20px">
        <li>📚 Follow structured <strong style="color:#e5e5e5">Learning Roadmaps</strong></li>
        <li>💻 Solve <strong style="color:#e5e5e5">Daily Coding Problems</strong> and earn XP</li>
        <li>🎥 Watch <strong style="color:#e5e5e5">Video Tutorials</strong> from experts</li>
        <li>🤖 Get help from your <strong style="color:#e5e5e5">AI Mentor</strong></li>
        <li>👥 Join the <strong style="color:#e5e5e5">Community</strong> and collaborate</li>
      </ul>
      <div style="text-align:center;margin:32px 0">
        <a href="${process.env.APP_URL || 'http://localhost:5000'}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">
          Start Learning
        </a>
      </div>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #2d2d4e;text-align:center">
      <p style="margin:0;color:#6b6b80;font-size:12px">© ${new Date().getFullYear()} CodeSphere. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}
