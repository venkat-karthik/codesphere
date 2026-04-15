import { Router } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import { requireAuth } from "../middleware";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await storage.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData = insertUserSchema.parse({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'student',
      level: 1,
      xp: 0,
      streak: 0,
      theme: 'nature',
      subscriptionType: 'free',
      totalStudyTime: 0,
    });

    const user = await storage.createUser(userData);
    req.session.userRole = user.role;
    await new Promise<void>((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));

    const { password: _, ...safeUser } = user;

    // Send welcome + OTP verification emails (non-blocking)
    import('../email').then(async ({ sendEmail, welcomeEmail, otpVerificationEmail }) => {
      await sendEmail(user.email, 'Welcome to CodeSphere!', welcomeEmail(user.firstName));

      const crypto = await import('crypto');
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await storage.updateUser(user.id, { otp, otpExpiry } as any);
      
      await sendEmail(user.email, 'Your CodeSphere Verification Code', otpVerificationEmail(user.firstName, otp));
    }).catch(() => {});

    return res.status(201).json({ user: safeUser });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;
    await new Promise<void>((resolve, reject) =>
      req.session.save(err => err ? reject(err) : resolve())
    );

    // Update streak on login
    const today = new Date().toDateString();
    const lastLogin = (user as any).preferences?.lastLoginDate;
    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = lastLogin === yesterday.toDateString();
      const newStreak = isConsecutive ? user.streak + 1 : 1;
      const currentCoins = (user as any).codeCoins || 0;
      const streakBonus = 5;
      await storage.updateUser(user.id, {
        streak: newStreak,
        codeCoins: currentCoins + streakBonus,
        preferences: { ...(user.preferences as any || {}), lastLoginDate: today },
      } as any);
      (user as any).streak = newStreak;
      (user as any).codeCoins = currentCoins + streakBonus;
    }

    const { password: _, ...safeUser } = user;
    return res.json({ user: { ...safeUser, streak: (user as any).streak } });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: "Logged out successfully" });
  });
});

// Change Password
router.post("/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Block demo accounts from changing password
    if (user.email === 'admin@codesphere.com' || user.email === 'student@codesphere.com') {
      return res.status(400).json({ message: "Demo accounts cannot change password" });
    }
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: "Current password is incorrect" });
    const hashed = await bcrypt.hash(newPassword, 12);
    await storage.updateUser(user.id, { password: hashed });
    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to change password" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }
    // Block demo accounts from password reset
    if (user.email === 'admin@codesphere.com' || user.email === 'student@codesphere.com') {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await storage.updateUser(user.id, {
      passwordResetToken: token,
      passwordResetExpiry: expiry,
    } as any);

    const APP_URL = process.env.APP_URL || `http://127.0.0.1:${process.env.PORT || 5000}`;
    const resetUrl = `${APP_URL}/reset-password?token=${token}`;

    // Send email but don't fail the request if it doesn't go through
    try {
      const { sendEmail, passwordResetEmail } = await import('../email');
      await sendEmail(user.email, 'Reset your CodeSphere password', passwordResetEmail(user.firstName, resetUrl));
    } catch (emailErr) {
      console.error("Failed to send password reset email:", emailErr);
      // Still return success — the token is saved, and we don't leak info
    }

    return res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Failed to process request" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await storage.getUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const expiry = (user as any).passwordResetExpiry;
    if (!expiry || new Date(expiry) < new Date()) {
      return res.status(400).json({ message: "Reset token has expired. Please request a new one." });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await storage.updateUser(user.id, {
      password: hashed,
      passwordResetToken: null,
      passwordResetExpiry: null,
    } as any);

    return res.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Failed to reset password" });
  }
});

// Verification Flows — OTP-based
router.post("/send-verification", requireAuth, async (req, res) => {
  try {
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.email === 'admin@codesphere.com' || user.email === 'student@codesphere.com') {
      return res.json({ message: "Demo accounts don't need verification" });
    }
    if ((user as any).emailVerified) return res.json({ message: "Email already verified" });

    // Rate limit: don't regenerate if an existing OTP hasn't expired yet
    const existingExpiry = (user as any).otpExpiry;
    if (existingExpiry && new Date(existingExpiry) > new Date()) {
      return res.json({ message: "Verification code already sent. Check your email." });
    }

    const crypto = await import('crypto');
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await storage.updateUser(user.id, { otp, otpExpiry } as any);

    const { sendEmail, otpVerificationEmail } = await import('../email');
    await sendEmail(user.email, 'Your CodeSphere Verification Code', otpVerificationEmail(user.firstName, otp));

    return res.json({ message: "Verification code sent to your email" });
  } catch (error) {
    console.error("Send verification error:", error);
    return res.status(500).json({ message: "Failed to send verification email" });
  }
});

router.post("/verify-otp", requireAuth, async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      return res.status(400).json({ message: "A 6-digit verification code is required" });
    }

    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });
    if ((user as any).emailVerified) return res.json({ message: "Email already verified" });

    if ((user as any).otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const expiry = (user as any).otpExpiry;
    if (!expiry || new Date(expiry) < new Date()) {
      return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
    }

    await storage.updateUser(user.id, {
      emailVerified: true,
      otp: null,
      otpExpiry: null,
      emailVerifyToken: null,
    } as any);

    return res.json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Verification failed" });
  }
});

// Legacy link-based verification (backward compat)
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const user = await storage.getUserByVerifyToken(token as string);
    if (!user) return res.status(400).json({ message: "Invalid or already used verification token" });

    await storage.updateUser(user.id, {
      emailVerified: true,
      emailVerifyToken: null,
    } as any);

    return res.redirect('/?verified=1');
  } catch (error) {
    return res.status(500).json({ message: "Verification failed" });
  }
});

router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }

    const { password: _, ...safeUser } = user;
    return res.json({ user: { ...safeUser, emailVerified: (user as any).emailVerified ?? false } });
  } catch (error) {
    console.error("Auth me error:", error);
    return res.status(500).json({ message: "Failed to get current user" });
  }
});

export default router;

