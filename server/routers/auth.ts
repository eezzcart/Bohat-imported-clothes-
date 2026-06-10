import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getUserByUsername, createUser, getUserById, updateUserLastSignedIn } from "../db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";

const SALT_ROUNDS = 10;
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin123"; // Default password - user should change this

// Initialize default admin account on server startup
export async function initializeDefaultAdmin() {
  try {
    const existingAdmin = await getUserByUsername(DEFAULT_ADMIN_USERNAME);
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, SALT_ROUNDS);
      await createUser(DEFAULT_ADMIN_USERNAME, passwordHash, "Admin", "admin@shop.local", "admin");
      console.log("[Auth] Default admin account created. Username: admin, Password: admin123");
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
      try {
        // Find user by username
        const user = await getUserByUsername(input.username);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        // Update last signed in
        await updateUserLastSignedIn(user.id);

        // Create session token (using JWT from SDK)
        const { sdk } = require("../_core/sdk");
        // Use a special prefix to indicate this is a local username/password session
        const sessionOpenId = `local_${user.id}`;
        const sessionToken = await sdk.createSessionToken(sessionOpenId, {
          name: user.name || user.username,
          expiresInMs: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.setHeader("Set-Cookie", `${COOKIE_NAME}=${sessionToken}; ${Object.entries(cookieOptions)
          .map(([key, value]) => {
            if (key === "maxAge") return `Max-Age=${value}`;
            if (key === "httpOnly") return "HttpOnly";
            if (key === "secure") return "Secure";
            if (key === "sameSite") return `SameSite=${value}`;
            if (key === "path") return `Path=${value}`;
            return `${key}=${value}`;
          })
          .join("; ")}`);

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
