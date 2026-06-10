import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { productsRouter } from "./routers/products";
import { categoriesRouter } from "./routers/categories";
import { authRouter } from "./routers/auth";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  products: productsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
