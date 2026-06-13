import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { initializeDefaultAdmin } from "./routers/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure body parser with larger size limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

registerStorageProxy(app);
registerOAuthRoutes(app);

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Serve static files from dist/public in production
const staticPath = path.resolve(__dirname, "public");
app.use(express.static(staticPath));

// Handle client-side routing - serve index.html for all routes
app.get("*", (req, res) => {
  // If it's an API request that wasn't caught by tRPC, return 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(staticPath, "index.html"));
});

// Standalone server for local development or other environments
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  const server = createServer(app);
  
  initializeDefaultAdmin().catch(console.error);
  
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

// Export for Vercel Serverless Functions
export default app;
