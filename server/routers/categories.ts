import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../db";
import { TRPCError } from "@trpc/server";

export const categoriesRouter = router({
  // List all categories
  list: protectedProcedure.query(async () => {
    try {
      const categories = await getAllCategories();
      return categories;
    } catch (error) {
      console.error("Failed to list categories:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list categories",
      });
    }
  }),

  // Get single category by ID
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const category = await getCategoryById(input.id);
      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }
      return category;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error("Failed to get category:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get category",
      });
    }
  }),

  // Create category
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Category name is required"),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await createCategory(input.name, input.description);
        return { success: true };
      } catch (error) {
        console.error("Failed to create category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create category",
        });
      }
    }),

  // Update category
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        const updateData: Record<string, unknown> = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;

        await updateCategory(id, updateData.name as string | undefined, updateData.description as string | undefined);
        return { success: true };
      } catch (error) {
        console.error("Failed to update category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update category",
        });
      }
    }),

  // Delete category
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await deleteCategory(input.id);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete category:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete category",
      });
    }
  }),
});
