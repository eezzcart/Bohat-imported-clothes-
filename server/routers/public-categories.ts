import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getAllCategories,
  getCategoryById,
} from "../db";
import { TRPCError } from "@trpc/server";

export const publicCategoriesRouter = router({
  // List all categories (public endpoint for storefront)
  list: publicProcedure.query(async () => {
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

  // Get single category by ID (public endpoint)
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
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
});
