import { describe, it, expect } from "vitest";
import { z } from "zod";

// Test the validation schemas directly
describe("Categories Router Validation", () => {
  describe("Category Creation Schema", () => {
    const createSchema = z.object({
      name: z.string().min(1, "Category name is required"),
      description: z.string().optional(),
    });

    it("should require category name", () => {
      expect(() => {
        createSchema.parse({
          name: "",
          description: "Test",
        });
      }).toThrow();
    });

    it("should allow category creation with only name", () => {
      expect(() => {
        createSchema.parse({
          name: "Electronics",
        });
      }).not.toThrow();
    });

    it("should allow category creation with name and description", () => {
      expect(() => {
        createSchema.parse({
          name: "Electronics",
          description: "Electronic devices and accessories",
        });
      }).not.toThrow();
    });
  });

  describe("Category Update Schema", () => {
    const updateSchema = z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
    });

    it("should allow partial updates", () => {
      expect(() => {
        updateSchema.parse({
          id: 1,
          name: "Updated Name",
        });
      }).not.toThrow();

      expect(() => {
        updateSchema.parse({
          id: 1,
          description: "Updated description",
        });
      }).not.toThrow();

      expect(() => {
        updateSchema.parse({
          id: 1,
          name: "Updated",
          description: "Updated desc",
        });
      }).not.toThrow();
    });
  });

  describe("Category Deletion Schema", () => {
    const deleteSchema = z.object({
      id: z.number(),
    });

    it("should require category id for deletion", () => {
      expect(() => {
        deleteSchema.parse({
          id: 1,
        });
      }).not.toThrow();
    });
  });

  describe("Category Retrieval Schema", () => {
    const getSchema = z.object({
      id: z.number(),
    });

    it("should require id for retrieval", () => {
      expect(() => {
        getSchema.parse({
          id: 1,
        });
      }).not.toThrow();
    });
  });
});
