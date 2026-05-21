import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);
const FROM = env.FROM_EMAIL || "Volks & David <onboarding@resend.dev>";

function baseTemplate(title: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <tr>
          <td style="background:linear-gradient(135deg,#21346E,#1a2a5c);padding:28px 40px;text-align:center">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px">
              <span style="color:#fff">Volks</span>
              <span style="color:#C8952E"> & </span>
              <span style="color:#C8952E">David</span>
            </h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:13px">${title}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px">
            ${body}
          </td>
        </tr>
        <tr>
          <td style="background:#f8f9fb;padding:20px 40px;text-align:center;border-top:1px solid #eee">
            <p style="margin:0;color:#999;font-size:12px">© 2025 Volks & David. All rights reserved.</p>
            <p style="margin:4px 0 0;color:#bbb;font-size:11px">If you did not request this, please ignore this email.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function otpBlock(code: string, expiresIn = "5 minutes") {
  return `
    <div style="background:#f0f4ff;border:1px solid #dde6ff;border-radius:10px;padding:24px;text-align:center;margin:20px 0">
      <p style="margin:0 0 8px;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:1px">Your verification code</p>
      <p style="margin:0;font-size:40px;font-weight:700;letter-spacing:14px;color:#21346E;font-family:monospace">${code}</p>
      <p style="margin:10px 0 0;color:#999;font-size:12px">Expires in ${expiresIn}</p>
    </div>`;
}

export async function sendEmailVerifyOtp(email: string, code: string) {
  if (!env.RESEND_API_KEY) {
    console.log(`[OTP email_verify] ${email}: ${code}`);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${code} – Verify your email | Volks & David`,
    html: baseTemplate(
      "Email Verification",
      `<p style="color:#444;font-size:15px;margin:0 0 4px">Hello,</p>
       <p style="color:#666;font-size:14px;margin:0 0 4px">Use the code below to verify your email address and activate your account.</p>
       ${otpBlock(code)}
       <p style="color:#888;font-size:13px;margin:16px 0 0">Do not share this code with anyone. Volks & David will never ask for your OTP.</p>`
    ),
  });
}

export async function sendPasswordResetOtp(email: string, code: string) {
  if (!env.RESEND_API_KEY) {
    console.log(`[OTP password_reset] ${email}: ${code}`);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${code} – Reset your password | Volks & David`,
    html: baseTemplate(
      "Password Reset",
      `<p style="color:#444;font-size:15px;margin:0 0 4px">Password reset requested</p>
       <p style="color:#666;font-size:14px;margin:0 0 4px">Enter this code to reset your password. If you didn't request this, ignore this email — your password won't change.</p>
       ${otpBlock(code)}
       <p style="color:#888;font-size:13px;margin:16px 0 0">For security, this code expires in 5 minutes.</p>`
    ),
  });
}

export async function sendAdminLoginOtp(email: string, code: string) {
  if (!env.RESEND_API_KEY) {
    console.log(`[OTP admin_2fa] ${email}: ${code}`);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${code} – Admin login verification | Volks & David`,
    html: baseTemplate(
      "Admin Login — 2-Factor Verification",
      `<p style="color:#444;font-size:15px;margin:0 0 4px">Admin login attempt detected</p>
       <p style="color:#666;font-size:14px;margin:0 0 4px">Someone is trying to log in to the admin panel. Use the code below to confirm it's you.</p>
       ${otpBlock(code)}
       <p style="color:#c0392b;font-size:13px;font-weight:600;margin:16px 0 0">⚠️ If this wasn't you, secure your account immediately.</p>`
    ),
  });
}
