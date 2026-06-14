import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getUserByUsername, createUser, getUserById, updateUserLastSignedIn } from "../db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";

const SALT_ROUNDS = 10;
const DEFAULT_ADMIN_USERNAME = "Bohat imported clothes";
const DEFAULT_ADMIN_PASSWORD = "bhatimported@098765"; // Updated credentials per user request

// Initialize default admin account on server startup
export async function initializeDefaultAdmin() {
  try {
    const existingAdmin = await getUserByUsername(DEFAULT_ADMIN_USERNAME);
    if (!existingAdmin) {
      // Create new admin if it doesn't exist
      const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, SALT_ROUNDS);
      await createUser(DEFAULT_ADMIN_USERNAME, passwordHash, "Admin", "admin@shop.local", "admin");
      console.log(`[Auth] Default admin account created. Username: ${DEFAULT_ADMIN_USERNAME}`);
    } else {
      // Update existing admin password to match the new one
      const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, SALT_ROUNDS);
      await updateUserPassword(existingAdmin.id, passwordHash);
      console.log(`[Auth] Admin password updated for: ${DEFAULT_ADMIN_USERNAME}`);
    }
  } catch (error) {
    console.error("[Auth] Failed to initialize default admin:", error);
  }
}

export const authRouter = router({
  // Get current user
  me: publicProcedure.query(async (opts) => opts.ctx.user),

  // Login with username and password (single admin account)
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(`[Auth] Login attempt for username: "${input.username}"`);
      
      // Always ensure the default admin exists/is updated on login attempt
      // This is necessary for serverless environments where startup scripts might be skipped
      await initializeDefaultAdmin();

      try {
        // Find user by username
        const user = await getUserByUsername(input.username);
        if (!user) {
          console.log(`[Auth] User not found: "${input.username}"`);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
          console.log(`[Auth] Password mismatch for user: "${input.username}"`);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }
        console.log(`[Auth] Login successful for user: "${input.username}"`);

        // Update last signed in
        await updateUserLastSignedIn(user.id);

        // Create session token (using JWT from SDK)
        const { sdk } = require("../_core/sdk");
        // Use a unique session ID per login to allow multiple devices
        const sessionOpenId = `local_${user.id}_${Date.now()}`;
        const sessionToken = await sdk.createSessionToken(sessionOpenId, {
          name: user.name || user.username,
          expiresInMs: 1 * 60 * 60 * 1000, // 1 hour session timeout
        });

            // Set session cookie - Session-only (expires when browser closes)
        const cookieOptions = getSessionCookieOptions(ctx.req);
        const cookieParts = [
          `${COOKIE_NAME}=${sessionToken}`,
          `Path=${cookieOptions.path || "/"}`,
          // NO Max-Age: Session-only cookie (expires when browser closes)
          "HttpOnly",
          "SameSite=Lax" // Changed from 'None' to 'Lax' for better browser compatibility without 'Secure' requirement in some environments
        ];

        if (cookieOptions.secure || process.env.NODE_ENV === "production") {
          cookieParts.push("Secure");
        }

        ctx.res.setHeader("Set-Cookie", cookieParts.join("; "));

        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Login failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed",
        });
      }
    }),

  // Change admin password
  changePassword: publicProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // User must be authenticated
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to change password",
          });
        }

        // Get user from database
        const user = await getUserById(ctx.user.id);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
        if (!isPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Current password is incorrect",
          });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);

        // Update password in database
        await updateUserPassword(ctx.user.id, newPasswordHash);

        return { success: true, message: "Password changed successfully" };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Change password failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to change password",
        });
      }
    }),

  // Logout
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  }),
});

import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Helper function to update user password
async function updateUserPassword(userId: number, passwordHash: string) {
  const db = getDb();
  const dbInstance = await db();
  if (!dbInstance) throw new Error("Database not available");

  await dbInstance.update(users).set({ passwordHash }).where(eq(users.id, userId));
}
