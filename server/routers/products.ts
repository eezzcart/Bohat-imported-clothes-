import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImages,
  addProductImage,
  deleteProductImage,
  reorderProductImages,
  setPrimaryImage,
  clearPrimaryImage,
} from "../db";
import { storagePut } from "../storage";
import { TRPCError } from "@trpc/server";

export const productsRouter = router({
  // List all products
  list: adminProcedure.query(async () => {
    try {
      const products = await getAllProducts();
      return products;
    } catch (error) {
      console.error("Failed to list products:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list products",
      });
    }
  }),

  // Get product by ID with images
  getById: adminProcedure
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

  // Create product
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1, "Product name is required"),
        description: z.string().optional(),
        price: z.number().min(0, "Price must be positive"),
        categoryId: z.number().optional(),
        stock: z.number().min(0, "Stock must be non-negative"),
        sku: z.string().optional(),
        status: z.enum(["active", "draft"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await createProduct({
          name: input.name,
          description: input.description,
          price: input.price.toString(),
          categoryId: input.categoryId,
          stock: input.stock,
          sku: input.sku,
          status: input.status,
        });
        const insertId = (result as any).insertId;
        const product = await getProductById(insertId);
        return product;
      } catch (error) {
        console.error("Failed to create product:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create product",
        });
      }
    }),

  // Update product
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        categoryId: z.number().optional(),
        stock: z.number().optional(),
        sku: z.string().optional(),
        status: z.enum(["active", "draft"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.price !== undefined) updateData.price = data.price.toString();
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
        if (data.stock !== undefined) updateData.stock = data.stock;
        if (data.sku !== undefined) updateData.sku = data.sku;
        if (data.status !== undefined) updateData.status = data.status;
        await updateProduct(id, updateData);
        return { success: true };
      } catch (error) {
        console.error("Failed to update product:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update product",
        });
      }
    }),

  // Delete product
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await deleteProduct(input.id);
        return { success: true };
      } catch (error) {
        console.error("Failed to delete product:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete product",
        });
      }
    }),

  // Upload product image
  uploadImage: adminProcedure
    .input(
      z.object({
        productId: z.number(),
        imageFile: z.instanceof(File),
        altText: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const fileBuffer = await input.imageFile.arrayBuffer();
        const { key, url } = await storagePut(
          `products/${input.productId}/${Date.now()}-${input.imageFile.name}`,
          Buffer.from(fileBuffer),
          input.imageFile.type
        );

        // Get current display order
        const existingImages = await getProductImages(input.productId);
        const displayOrder = existingImages.length;

        // Add image record to database
        await addProductImage(input.productId, url, key, input.altText, displayOrder);

        return { success: true, url, key };
      } catch (error) {
        console.error("Failed to upload image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload image",
        });
      }
    }),

  // Delete product image
  deleteImage: adminProcedure.input(z.object({ imageId: z.number() })).mutation(async ({ input }) => {
    try {
      await deleteProductImage(input.imageId);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete image:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete image",
      });
    }
  }),

  // Reorder product images
  reorderImages: adminProcedure
    .input(
      z.object({
        images: z.array(
          z.object({
            id: z.number(),
            displayOrder: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await reorderProductImages(input.images);
        return { success: true };
      } catch (error) {
        console.error("Failed to reorder images:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reorder images",
        });
      }
    }),

  // Set primary image
  setPrimaryImage: adminProcedure
    .input(
      z.object({
        productId: z.number(),
        imageId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await setPrimaryImage(input.productId, input.imageId);
        return { success: true };
      } catch (error) {
        console.error("Failed to set primary image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set primary image",
        });
      }
    }),

  // Clear primary image
  clearPrimaryImage: adminProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await clearPrimaryImage(input.productId);
        return { success: true };
      } catch (error) {
        console.error("Failed to clear primary image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to clear primary image",
        });
      }
    }),

  // Get product images
  getImages: adminProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      try {
        const images = await getProductImages(input.productId);
        return images;
      } catch (error) {
        console.error("Failed to get product images:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get product images",
        });
      }
    }),
});
