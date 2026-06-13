var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// shared/const.ts
var COOKIE_NAME, ONE_YEAR_MS, UNAUTHED_ERR_MSG, NOT_ADMIN_ERR_MSG, AXIOS_TIMEOUT_MS;
var init_const = __esm({
  "shared/const.ts"() {
    "use strict";
    COOKIE_NAME = "app_session_id";
    ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
    UNAUTHED_ERR_MSG = "UNAUTHENTICATED";
    NOT_ADMIN_ERR_MSG = "NOT_ADMIN";
    AXIOS_TIMEOUT_MS = 3e4;
  }
});

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, varchar, timestamp, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
var users, categories, products, productImages, categoriesRelations, productsRelations, productImagesRelations;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      /**
       * Surrogate primary key. Auto-incremented numeric value managed by the database.
       * Use this for relations between tables.
       */
      id: int("id").autoincrement().primaryKey(),
      /** Username for login */
      username: varchar("username", { length: 100 }).notNull().unique(),
      /** Hashed password using bcrypt */
      passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
      /** Optional: Manus OAuth identifier for backward compatibility */
      openId: varchar("openId", { length: 64 }).unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }).default("username"),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    categories = mysqlTable("categories", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull().unique(),
      description: text("description"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    products = mysqlTable("products", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description"),
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      categoryId: int("categoryId").references(() => categories.id),
      stock: int("stock").notNull().default(0),
      sku: varchar("sku", { length: 100 }).unique(),
      status: mysqlEnum("status", ["active", "draft"]).default("draft").notNull(),
      primaryImageId: int("primaryImageId"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    productImages = mysqlTable("productImages", {
      id: int("id").autoincrement().primaryKey(),
      productId: int("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
      imageUrl: text("imageUrl").notNull(),
      imageKey: varchar("imageKey", { length: 255 }).notNull(),
      altText: varchar("altText", { length: 255 }),
      displayOrder: int("displayOrder").default(0),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    categoriesRelations = relations(categories, ({ many }) => ({
      products: many(products)
    }));
    productsRelations = relations(products, ({ one, many }) => ({
      category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id]
      }),
      images: many(productImages)
    }));
    productImagesRelations = relations(productImages, ({ one }) => ({
      product: one(products, {
        fields: [productImages.productId],
        references: [products.id]
      })
    }));
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function createUser(username, passwordHash, name, email, role = "user") {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.insert(users).values({
    username,
    passwordHash,
    name,
    email,
    loginMethod: "username",
    role,
    lastSignedIn: /* @__PURE__ */ new Date()
  });
  return result;
}
async function getUserByUsername(username) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserById(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateUserLastSignedIn(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }
  await db.update(users).set({ lastSignedIn: /* @__PURE__ */ new Date() }).where(eq(users.id, id));
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products);
}
async function getProductById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createProduct(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  return result;
}
async function updateProduct(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(data).where(eq(products.id, id));
}
async function deleteProduct(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}
async function addProductImage(productId, imageUrl, imageKey, altText, displayOrder = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(productImages).values({
    productId,
    imageUrl,
    imageKey,
    altText,
    displayOrder
  });
  return result;
}
async function getProductImages(productId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productImages).where(eq(productImages.productId, productId));
}
async function deleteProductImage(imageId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productImages).where(eq(productImages.id, imageId));
}
async function reorderProductImages(images) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const img of images) {
    await db.update(productImages).set({ displayOrder: img.displayOrder }).where(eq(productImages.id, img.id));
  }
}
async function setPrimaryImage(productId, imageId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set({ primaryImageId: imageId }).where(eq(products.id, productId));
}
async function clearPrimaryImage(productId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set({ primaryImageId: null }).where(eq(products.id, productId));
}
async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories);
}
async function getCategoryById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createCategory(name, description) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values({
    name,
    description
  });
  return result;
}
async function updateCategory(id, name, description) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData = {};
  if (name !== void 0) updateData.name = name;
  if (description !== void 0) updateData.description = description;
  await db.update(categories).set(updateData).where(eq(categories.id, id));
}
async function deleteCategory(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(eq(categories.id, id));
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// shared/_core/errors.ts
var HttpError, ForbiddenError;
var init_errors = __esm({
  "shared/_core/errors.ts"() {
    "use strict";
    HttpError = class extends Error {
      constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "HttpError";
      }
    };
    ForbiddenError = (msg) => new HttpError(403, msg);
  }
});

// server/_core/sdk.ts
var sdk_exports = {};
__export(sdk_exports, {
  sdk: () => sdk
});
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var isNonEmptyString, EXCHANGE_TOKEN_PATH, GET_USER_INFO_PATH, GET_USER_INFO_WITH_JWT_PATH, OAuthService, createOAuthHttpClient, SDKServer, CRON_OPEN_ID_PREFIX, sdk;
var init_sdk = __esm({
  "server/_core/sdk.ts"() {
    "use strict";
    init_const();
    init_errors();
    init_db();
    init_env();
    isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
    EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
    GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
    GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
    OAuthService = class {
      constructor(client) {
        this.client = client;
        console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
        if (!ENV.oAuthServerUrl) {
          console.error(
            "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
          );
        }
      }
      decodeState(state) {
        const redirectUri = atob(state);
        return redirectUri;
      }
      async getTokenByCode(code, state) {
        const payload = {
          clientId: ENV.appId,
          grantType: "authorization_code",
          code,
          redirectUri: this.decodeState(state)
        };
        const { data } = await this.client.post(
          EXCHANGE_TOKEN_PATH,
          payload
        );
        return data;
      }
      async getUserInfoByToken(token) {
        const { data } = await this.client.post(
          GET_USER_INFO_PATH,
          {
            accessToken: token.accessToken
          }
        );
        return data;
      }
    };
    createOAuthHttpClient = () => axios.create({
      baseURL: ENV.oAuthServerUrl,
      timeout: AXIOS_TIMEOUT_MS
    });
    SDKServer = class {
      client;
      oauthService;
      constructor(client = createOAuthHttpClient()) {
        this.client = client;
        this.oauthService = new OAuthService(this.client);
      }
      deriveLoginMethod(platforms, fallback) {
        if (fallback && fallback.length > 0) return fallback;
        if (!Array.isArray(platforms) || platforms.length === 0) return null;
        const set = new Set(
          platforms.filter((p) => typeof p === "string")
        );
        if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
        if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
        if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
        if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
          return "microsoft";
        if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
        const first = Array.from(set)[0];
        return first ? first.toLowerCase() : null;
      }
      /**
       * Exchange OAuth authorization code for access token
       * @example
       * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
       */
      async exchangeCodeForToken(code, state) {
        return this.oauthService.getTokenByCode(code, state);
      }
      /**
       * Get user information using access token
       * @example
       * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
       */
      async getUserInfo(accessToken) {
        const data = await this.oauthService.getUserInfoByToken({
          accessToken
        });
        const loginMethod = this.deriveLoginMethod(
          data?.platforms,
          data?.platform ?? data.platform ?? null
        );
        return {
          ...data,
          platform: loginMethod,
          loginMethod
        };
      }
      parseCookies(cookieHeader) {
        if (!cookieHeader) {
          return /* @__PURE__ */ new Map();
        }
        const parsed = parseCookieHeader(cookieHeader);
        return new Map(Object.entries(parsed));
      }
      getSessionSecret() {
        const secret = ENV.cookieSecret;
        return new TextEncoder().encode(secret);
      }
      /**
       * Create a session token for a Manus user openId
       * @example
       * const sessionToken = await sdk.createSessionToken(userInfo.openId);
       */
      async createSessionToken(openId, options = {}) {
        return this.signSession(
          {
            openId,
            appId: ENV.appId,
            name: options.name || ""
          },
          options
        );
      }
      async signSession(payload, options = {}) {
        const issuedAt = Date.now();
        const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
        const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
        const secretKey = this.getSessionSecret();
        return new SignJWT({
          openId: payload.openId,
          appId: payload.appId,
          name: payload.name
        }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
      }
      async verifySession(cookieValue) {
        if (!cookieValue) {
          console.warn("[Auth] Missing session cookie");
          return null;
        }
        try {
          const secretKey = this.getSessionSecret();
          const { payload } = await jwtVerify(cookieValue, secretKey, {
            algorithms: ["HS256"]
          });
          const { openId, appId, name } = payload;
          if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
            console.warn("[Auth] Session payload missing required fields");
            return null;
          }
          return {
            openId,
            appId,
            name
          };
        } catch (error) {
          console.warn("[Auth] Session verification failed", String(error));
          return null;
        }
      }
      async getUserInfoWithJwt(jwtToken) {
        const payload = {
          jwtToken,
          projectId: ENV.appId
        };
        const { data } = await this.client.post(
          GET_USER_INFO_WITH_JWT_PATH,
          payload
        );
        const loginMethod = this.deriveLoginMethod(
          data?.platforms,
          data?.platform ?? data.platform ?? null
        );
        return {
          ...data,
          platform: loginMethod,
          loginMethod
        };
      }
      async authenticateRequest(req) {
        const cookies = this.parseCookies(req.headers.cookie);
        const sessionCookie = cookies.get(COOKIE_NAME);
        const session = await this.verifySession(sessionCookie);
        if (!session) {
          throw ForbiddenError("Invalid session cookie");
        }
        if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
          const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
          const taskUid = userInfo.taskUid ?? null;
          if (!taskUid) {
            throw ForbiddenError("Cron session missing task_uid");
          }
          return buildCronUser(userInfo);
        }
        const sessionUserId = session.openId;
        const signedInAt = /* @__PURE__ */ new Date();
        let user = null;
        if (sessionUserId.startsWith("local_")) {
          const userId = parseInt(sessionUserId.substring(6), 10);
          if (!isNaN(userId)) {
            user = await getUserById(userId);
          }
        } else {
          user = await getUserByOpenId(sessionUserId);
        }
        if (!user) {
          try {
            const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
            const tempUsername = `oauth_${userInfo.openId.substring(0, 20)}`;
            await createUser(tempUsername, "", userInfo.name || void 0, userInfo.email || void 0);
            const newUser = await getUserByUsername(tempUsername);
            if (newUser) {
              await upsertUser({
                id: newUser.id,
                username: tempUsername,
                passwordHash: "",
                openId: userInfo.openId,
                name: userInfo.name || null,
                email: userInfo.email ?? null,
                loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
                lastSignedIn: signedInAt
              });
            }
            user = await getUserByOpenId(userInfo.openId);
          } catch (error) {
            console.error("[Auth] Failed to sync user from OAuth:", error);
            throw ForbiddenError("Failed to sync user info");
          }
        }
        if (!user) {
          throw ForbiddenError("User not found");
        }
        if (user.id) {
          await updateUserLastSignedIn(user.id);
        }
        return user;
      }
    };
    CRON_OPEN_ID_PREFIX = "cron_";
    sdk = new SDKServer();
  }
});

// server/index.ts
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/_core/oauth.ts
init_const();
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/oauth.ts
init_sdk();
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      const tempUsername = `oauth_${userInfo.openId.substring(0, 20)}`;
      const existingUser = await getUserByOpenId(userInfo.openId);
      if (!existingUser) {
        await createUser(tempUsername, "", userInfo.name || void 0, userInfo.email || void 0);
      }
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
init_env();
function registerStorageProxy(app2) {
  app2.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
init_const();
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/products.ts
import { z as z2 } from "zod";
init_db();

// server/storage.ts
init_env();
function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;
  if (!forgeUrl || !forgeKey) {
    throw new Error(
      "Storage config missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function appendHashSuffix(relKey) {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = appendHashSuffix(normalizeKey(relKey));
  const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
  presignUrl.searchParams.set("path", key);
  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` }
  });
  if (!presignResp.ok) {
    const msg = await presignResp.text().catch(() => presignResp.statusText);
    throw new Error(`Storage presign failed (${presignResp.status}): ${msg}`);
  }
  const { url: s3Url } = await presignResp.json();
  if (!s3Url) throw new Error("Forge returned empty presign URL");
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const uploadResp = await fetch(s3Url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob
  });
  if (!uploadResp.ok) {
    throw new Error(`Storage upload to S3 failed (${uploadResp.status})`);
  }
  return { key, url: `/manus-storage/${key}` };
}

// server/routers/products.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
var productsRouter = router({
  // List all products
  list: adminProcedure.query(async () => {
    try {
      const products2 = await getAllProducts();
      return products2;
    } catch (error) {
      console.error("Failed to list products:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list products"
      });
    }
  }),
  // Get product by ID with images
  getById: adminProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
    try {
      const product = await getProductById(input.id);
      if (!product) {
        throw new TRPCError3({
          code: "NOT_FOUND",
          message: "Product not found"
        });
      }
      const images = await getProductImages(input.id);
      return { ...product, images };
    } catch (error) {
      if (error instanceof TRPCError3) throw error;
      console.error("Failed to get product:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get product"
      });
    }
  }),
  // Create product
  create: adminProcedure.input(
    z2.object({
      name: z2.string().min(1, "Product name is required"),
      description: z2.string().optional(),
      price: z2.number().min(0, "Price must be positive"),
      categoryId: z2.number().optional(),
      stock: z2.number().min(0, "Stock must be non-negative"),
      sku: z2.string().optional(),
      status: z2.enum(["active", "draft"])
    })
  ).mutation(async ({ input }) => {
    try {
      const result = await createProduct({
        name: input.name,
        description: input.description,
        price: input.price.toString(),
        categoryId: input.categoryId,
        stock: input.stock,
        sku: input.sku,
        status: input.status
      });
      const insertId = result.insertId;
      const product = await getProductById(insertId);
      return product;
    } catch (error) {
      console.error("Failed to create product:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create product"
      });
    }
  }),
  // Update product
  update: adminProcedure.input(
    z2.object({
      id: z2.number(),
      name: z2.string().optional(),
      description: z2.string().optional(),
      price: z2.number().optional(),
      categoryId: z2.number().optional(),
      stock: z2.number().optional(),
      sku: z2.string().optional(),
      status: z2.enum(["active", "draft"]).optional()
    })
  ).mutation(async ({ input }) => {
    try {
      const { id, ...data } = input;
      const updateData = {};
      if (data.name !== void 0) updateData.name = data.name;
      if (data.description !== void 0) updateData.description = data.description;
      if (data.price !== void 0) updateData.price = data.price.toString();
      if (data.categoryId !== void 0) updateData.categoryId = data.categoryId;
      if (data.stock !== void 0) updateData.stock = data.stock;
      if (data.sku !== void 0) updateData.sku = data.sku;
      if (data.status !== void 0) updateData.status = data.status;
      await updateProduct(id, updateData);
      return { success: true };
    } catch (error) {
      console.error("Failed to update product:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update product"
      });
    }
  }),
  // Delete product
  delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
    try {
      await deleteProduct(input.id);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete product"
      });
    }
  }),
  // Upload product image
  uploadImage: adminProcedure.input(
    z2.object({
      productId: z2.number(),
      imageFile: z2.instanceof(File),
      altText: z2.string().optional()
    })
  ).mutation(async ({ input }) => {
    try {
      const fileBuffer = await input.imageFile.arrayBuffer();
      const { key, url } = await storagePut(
        `products/${input.productId}/${Date.now()}-${input.imageFile.name}`,
        Buffer.from(fileBuffer),
        input.imageFile.type
      );
      const existingImages = await getProductImages(input.productId);
      const displayOrder = existingImages.length;
      await addProductImage(input.productId, url, key, input.altText, displayOrder);
      return { success: true, url, key };
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload image"
      });
    }
  }),
  // Delete product image
  deleteImage: adminProcedure.input(z2.object({ imageId: z2.number() })).mutation(async ({ input }) => {
    try {
      await deleteProductImage(input.imageId);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete image:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete image"
      });
    }
  }),
  // Reorder product images
  reorderImages: adminProcedure.input(
    z2.object({
      images: z2.array(
        z2.object({
          id: z2.number(),
          displayOrder: z2.number()
        })
      )
    })
  ).mutation(async ({ input }) => {
    try {
      await reorderProductImages(input.images);
      return { success: true };
    } catch (error) {
      console.error("Failed to reorder images:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to reorder images"
      });
    }
  }),
  // Set primary image
  setPrimaryImage: adminProcedure.input(
    z2.object({
      productId: z2.number(),
      imageId: z2.number()
    })
  ).mutation(async ({ input }) => {
    try {
      await setPrimaryImage(input.productId, input.imageId);
      return { success: true };
    } catch (error) {
      console.error("Failed to set primary image:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to set primary image"
      });
    }
  }),
  // Clear primary image
  clearPrimaryImage: adminProcedure.input(z2.object({ productId: z2.number() })).mutation(async ({ input }) => {
    try {
      await clearPrimaryImage(input.productId);
      return { success: true };
    } catch (error) {
      console.error("Failed to clear primary image:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to clear primary image"
      });
    }
  }),
  // Get product images
  getImages: adminProcedure.input(z2.object({ productId: z2.number() })).query(async ({ input }) => {
    try {
      const images = await getProductImages(input.productId);
      return images;
    } catch (error) {
      console.error("Failed to get product images:", error);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get product images"
      });
    }
  })
});

// server/routers/categories.ts
import { z as z3 } from "zod";
init_db();
import { TRPCError as TRPCError4 } from "@trpc/server";
var categoriesRouter = router({
  // List all categories
  list: adminProcedure.query(async () => {
    try {
      const categories2 = await getAllCategories();
      return categories2;
    } catch (error) {
      console.error("Failed to list categories:", error);
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list categories"
      });
    }
  }),
  // Get single category by ID
  getById: adminProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
    try {
      const category = await getCategoryById(input.id);
      if (!category) {
        throw new TRPCError4({
          code: "NOT_FOUND",
          message: "Category not found"
        });
      }
      return category;
    } catch (error) {
      if (error instanceof TRPCError4) throw error;
      console.error("Failed to get category:", error);
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get category"
      });
    }
  }),
  // Create category
  create: adminProcedure.input(
    z3.object({
      name: z3.string().min(1, "Category name is required"),
      description: z3.string().optional()
    })
  ).mutation(async ({ input }) => {
    try {
      await createCategory(input.name, input.description);
      return { success: true };
    } catch (error) {
      console.error("Failed to create category:", error);
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create category"
      });
    }
  }),
  // Update category
  update: adminProcedure.input(
    z3.object({
      id: z3.number(),
      name: z3.string().min(1).optional(),
      description: z3.string().optional()
    })
  ).mutation(async ({ input }) => {
    try {
      const { id, ...data } = input;
      const updateData = {};
      if (data.name !== void 0) updateData.name = data.name;
      if (data.description !== void 0) updateData.description = data.description;
      await updateCategory(id, updateData.name, updateData.description);
      return { success: true };
    } catch (error) {
      console.error("Failed to update category:", error);
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update category"
      });
    }
  }),
  // Delete category
  delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
    try {
      await deleteCategory(input.id);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete category:", error);
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete category"
      });
    }
  })
});

// server/routers/auth.ts
import { z as z4 } from "zod";
init_db();
init_const();
import { TRPCError as TRPCError5 } from "@trpc/server";
import bcrypt from "bcryptjs";
init_db();
init_schema();
import { eq as eq2 } from "drizzle-orm";
var SALT_ROUNDS = 10;
var DEFAULT_ADMIN_USERNAME = "admin";
var DEFAULT_ADMIN_PASSWORD = "admin123";
async function initializeDefaultAdmin() {
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
var authRouter = router({
  // Get current user
  me: publicProcedure.query(async (opts) => opts.ctx.user),
  // Login with username and password (single admin account)
  login: publicProcedure.input(
    z4.object({
      username: z4.string().min(1, "Username is required"),
      password: z4.string().min(1, "Password is required")
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      const user = await getUserByUsername(input.username);
      if (!user) {
        throw new TRPCError5({
          code: "UNAUTHORIZED",
          message: "Invalid username or password"
        });
      }
      const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new TRPCError5({
          code: "UNAUTHORIZED",
          message: "Invalid username or password"
        });
      }
      await updateUserLastSignedIn(user.id);
      const { sdk: sdk2 } = (init_sdk(), __toCommonJS(sdk_exports));
      const sessionOpenId = `local_${user.id}`;
      const sessionToken = await sdk2.createSessionToken(sessionOpenId, {
        name: user.name || user.username,
        expiresInMs: 30 * 24 * 60 * 60 * 1e3
        // 30 days
      });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.setHeader("Set-Cookie", `${COOKIE_NAME}=${sessionToken}; ${Object.entries(cookieOptions).map(([key, value]) => {
        if (key === "maxAge") return `Max-Age=${value}`;
        if (key === "httpOnly") return "HttpOnly";
        if (key === "secure") return "Secure";
        if (key === "sameSite") return `SameSite=${value}`;
        if (key === "path") return `Path=${value}`;
        return `${key}=${value}`;
      }).join("; ")}`);
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      if (error instanceof TRPCError5) throw error;
      console.error("Login failed:", error);
      throw new TRPCError5({
        code: "INTERNAL_SERVER_ERROR",
        message: "Login failed"
      });
    }
  }),
  // Change admin password
  changePassword: publicProcedure.input(
    z4.object({
      currentPassword: z4.string().min(1, "Current password is required"),
      newPassword: z4.string().min(6, "New password must be at least 6 characters")
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      if (!ctx.user) {
        throw new TRPCError5({
          code: "UNAUTHORIZED",
          message: "You must be logged in to change password"
        });
      }
      const user = await getUserById(ctx.user.id);
      if (!user) {
        throw new TRPCError5({
          code: "NOT_FOUND",
          message: "User not found"
        });
      }
      const isPasswordValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        throw new TRPCError5({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect"
        });
      }
      const newPasswordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
      await updateUserPassword(ctx.user.id, newPasswordHash);
      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      if (error instanceof TRPCError5) throw error;
      console.error("Change password failed:", error);
      throw new TRPCError5({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to change password"
      });
    }
  }),
  // Logout
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  })
});
async function updateUserPassword(userId, passwordHash) {
  const db = getDb();
  const dbInstance = await db();
  if (!dbInstance) throw new Error("Database not available");
  await dbInstance.update(users).set({ passwordHash }).where(eq2(users.id, userId));
}

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: authRouter,
  products: productsRouter,
  categories: categoriesRouter
});

// server/_core/context.ts
init_sdk();
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerStorageProxy(app);
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var staticPath = path.resolve(__dirname, "public");
app.use(express.static(staticPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(staticPath, "index.html"));
});
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const port = process.env.PORT || 3e3;
  const server = createServer(app);
  initializeDefaultAdmin().catch(console.error);
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
var index_default = app;
export {
  index_default as default
};
