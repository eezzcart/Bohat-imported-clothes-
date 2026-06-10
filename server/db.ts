import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, categories, productImages, InsertProduct } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
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

// Create a new user with username and password
export async function createUser(username: string, passwordHash: string, name?: string, email?: string, role: "user" | "admin" = "user"): Promise<any> {
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
    lastSignedIn: new Date(),
  });

  return result;
}

// Get user by username
export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Get user by ID
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Update user last signed in
export async function updateUserLastSignedIn(id: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }

  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, id));
}

// OAuth compatibility: upsert user from OAuth
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: any = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

// Get user by openId (OAuth)
export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ PRODUCT FUNCTIONS ============

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(products);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(products).where(eq(products.id, id));
}

// ============ PRODUCT IMAGE FUNCTIONS ============

export async function addProductImage(productId: number, imageUrl: string, imageKey: string, altText?: string, displayOrder: number = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(productImages).values({
    productId,
    imageUrl,
    imageKey,
    altText,
    displayOrder,
  });

  return result;
}

export async function getProductImages(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(productImages).where(eq(productImages.productId, productId));
}

export async function deleteProductImage(imageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(productImages).where(eq(productImages.id, imageId));
}

export async function reorderProductImages(images: Array<{ id: number; displayOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  for (const img of images) {
    await db.update(productImages).set({ displayOrder: img.displayOrder }).where(eq(productImages.id, img.id));
  }
}

export async function setPrimaryImage(productId: number, imageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(products).set({ primaryImageId: imageId }).where(eq(products.id, productId));
}

export async function clearPrimaryImage(productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(products).set({ primaryImageId: null }).where(eq(products.id, productId));
}

// ============ CATEGORY FUNCTIONS ============

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(categories);
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(name: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(categories).values({
    name,
    description,
  });

  return result;
}

export async function updateCategory(id: number, name?: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;

  await db.update(categories).set(updateData).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(categories).where(eq(categories.id, id));
}
