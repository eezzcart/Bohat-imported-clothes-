import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getAllProducts,
  getProductById,
  getProductImages,
} from "../db";
import { TRPCError } from "@trpc/server";

export const publicProductsRouter = router({
  // List all active products (public endpoint for storefront)
  list: publicProcedure.query(async () => {
    try {
      const products = await getAllProducts();
      // Filter to only active products for public view
      return products.filter(p => p.status === 'active');
    } catch (error) {
      console.error("Failed to list products:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list products",
      });
    }
  }),

  // Get product by ID with images (public endpoint)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const product = await getProductById(input.id);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }
        // Only return active products
        if (product.status !== 'active') {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }
        const images = await getProductImages(input.id);
        return { ...product, images };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Failed to get product:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get product",
        });
      }
    }),
});
