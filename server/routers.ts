import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { productsRouter } from "./routers/products";
import { categoriesRouter } from "./routers/categories";
import { authRouter } from "./routers/auth";
import { publicProductsRouter } from "./routers/public-products";
import { publicCategoriesRouter } from "./routers/public-categories";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  products: productsRouter,
  categories: categoriesRouter,
  publicProducts: publicProductsRouter,
  publicCategories: publicCategoriesRouter,
});

export type AppRouter = typeof appRouter;
