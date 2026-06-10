import { describe, it, expect } from "vitest";
import { z } from "zod";
import bcrypt from "bcryptjs";

describe("Auth Router Validation", () => {
  describe("Login Schema", () => {
    const loginSchema = z.object({
      username: z.string().min(1, "Username is required"),
      password: z.string().min(1, "Password is required"),
    });

    it("should require username and password", () => {
      expect(() => {
        loginSchema.parse({
          username: "",
          password: "password123",
        });
      }).toThrow();

      expect(() => {
        loginSchema.parse({
          username: "testuser",
          password: "",
        });
      }).toThrow();
    });

    it("should accept valid login credentials", () => {
      expect(() => {
        loginSchema.parse({
          username: "testuser",
          password: "password123",
        });
      }).not.toThrow();
    });
  });

  describe("Register Schema", () => {
    const registerSchema = z.object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      name: z.string().optional(),
      email: z.string().email().optional(),
    });

    it("should validate username minimum length", () => {
      expect(() => {
        registerSchema.parse({
          username: "ab",
          password: "password123",
        });
      }).toThrow();
    });

    it("should validate password minimum length", () => {
      expect(() => {
        registerSchema.parse({
          username: "testuser",
          password: "pass",
        });
      }).toThrow();
    });

    it("should validate email format", () => {
      expect(() => {
        registerSchema.parse({
          username: "testuser",
          password: "password123",
          email: "invalid-email",
        });
      }).toThrow();
    });

    it("should accept valid registration data", () => {
      expect(() => {
        registerSchema.parse({
          username: "testuser",
          password: "password123",
          name: "Test User",
          email: "test@example.com",
        });
      }).not.toThrow();
    });

    it("should accept registration without optional fields", () => {
      expect(() => {
        registerSchema.parse({
          username: "testuser",
          password: "password123",
        });
      }).not.toThrow();
    });
  });

  describe("Password Hashing", () => {
    it("should hash passwords with bcrypt", async () => {
      const password = "testpassword123";
      const hash = await bcrypt.hash(password, 10);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it("should verify correct password", async () => {
      const password = "testpassword123";
      const hash = await bcrypt.hash(password, 10);
      const isValid = await bcrypt.compare(password, hash);

      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "testpassword123";
      const hash = await bcrypt.hash(password, 10);
      const isValid = await bcrypt.compare("wrongpassword", hash);

      expect(isValid).toBe(false);
    });
  });
});
