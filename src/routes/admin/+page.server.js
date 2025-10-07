import { eq } from "drizzle-orm";
import { websitesTable, shopCategoriesTable, shopItemsTable, shopSubcategoriesTable, userTable, sessionTable } from "$lib/server/db/schema";
import { error, fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { verifyPasswordHash, createPasswordHash } from "$lib/server/password-hasher";

const toNullableString = (value) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

const createBaseItemSchema = () =>
  z.object({
    name: z.string().trim().min(1, { message: "Item name is required" }),
    price: z.string().trim().min(1, { message: "Price is required" })
      .refine((val) => !Number.isNaN(parseFloat(val)), { message: "Price must be a valid number" })
      .transform((val) => Math.round(parseFloat(val) * 100)),
    link: z.string().trim().url({ message: "Please enter a valid URL" }),
    description: z.string().trim().max(1000, { message: "Description must be 1000 characters or less" }).optional(),
    category_id: z.string().trim().min(1, { message: "Category is required" })
      .refine((val) => !Number.isNaN(parseInt(val, 10)), { message: "Invalid category" }),
    subcategory_id: z.string().optional()
      .refine((val) => !val || !Number.isNaN(parseInt(val, 10)), { message: "Invalid subcategory" })
      .transform((val) => {
        if (!val) return null;
        const parsed = parseInt(val, 10);
        return Number.isNaN(parsed) ? null : parsed;
      }),
  });

const addItemSchema = createBaseItemSchema();

const updateItemSchema = createBaseItemSchema()
  .extend({
    id: z.string().trim().min(1, { message: "Item ID is required" })
      .refine((val) => !Number.isNaN(parseInt(val, 10)), { message: "Invalid item ID" })
      .transform((val) => parseInt(val, 10)),
  });

const normalizeItemPayload = (data) => ({
  ...data,
  description: data.description?.trim?.() ?? "",
});

export const load = async ({ locals }) => {
  if (!locals?.user?.id) return redirect(302, "/login");

  const [websites, categories, subcategories, items] = await Promise.all([
    locals.DB.select().from(websitesTable),
    locals.DB.select().from(shopCategoriesTable),
    locals.DB.select().from(shopSubcategoriesTable),
    locals.DB.select().from(shopItemsTable)
  ]);

  return {
    user: locals.user,
    links: websites,
    categories,
    subcategories,
    items
  };
};

export const actions = {
  addLink: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    console.log(locals.user.id);

    const formData = await request.formData();
    const url = formData.get("url");
    const title = formData.get("title");
    const description = formData.get("description");

    const linkSchema = z.object({
      url: z.string().trim().url({ message: "Please enter a valid URL" }),
      title: z.string().trim().min(1, { message: "Title is required" }),
      description: z.string().trim().optional(),
    });

    try {
      const { url: validUrl, title: validTitle, description: validDescription } = linkSchema.parse({
        url,
        title,
        description,
      });

      await locals.DB.insert(websitesTable).values({
        title: validTitle,
        link: validUrl,
        description: validDescription,
        user_id: locals.user.id,
      });

      return {
        success: true,
        action: "addLink"
      };
    } catch (error) {
      console.error("Error adding link:", error);
      const message = error?.errors?.[0]?.message || "Failed to add link";
      const field = error?.errors?.[0]?.path?.[0];
      return fail(400, {
        message,
        field,
        action: "addLink"
      });
    }
  },

  updateLink: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const id = formData.get("id");
    const url = formData.get("url");
    const title = formData.get("title");
    const description = formData.get("description");

    const linkSchema = z.object({
      id: z.string().trim().min(1, { message: "Link ID is required" })
        .refine((val) => !Number.isNaN(parseInt(val, 10)), { message: "Invalid link ID" })
        .transform((val) => parseInt(val, 10)),
      url: z.string().trim().url({ message: "Please enter a valid URL" }),
      title: z.string().trim().min(1, { message: "Title is required" }),
      description: z.string().trim().optional(),
    });

    try {
      const { id: linkId, url: validUrl, title: validTitle, description: validDescription } = linkSchema.parse({
        id,
        url,
        title,
        description,
      });

      await locals.DB.update(websitesTable)
        .set({
          title: validTitle,
          link: validUrl,
          description: validDescription || "",
        })
        .where(eq(websitesTable.id, linkId));

      return {
        success: true,
        action: "updateLink"
      };
    } catch (error) {
      console.error("Error updating link:", error);
      const message = error?.errors?.[0]?.message || "Failed to update link";
      const field = error?.errors?.[0]?.path?.[0];
      return fail(400, {
        message,
        field,
        action: "updateLink"
      });
    }
  },

  deleteLink: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return fail(400, {
        message: "Link ID is required",
        action: "deleteLink"
      });
    }

    try {
      await locals.DB.delete(websitesTable).where(eq(websitesTable.id, parseInt(id, 10)));
      return {
        success: true,
        action: "deleteLink"
      };
    } catch (error) {
      console.error("Error deleting link:", error);
      return fail(500, {
        message: "Failed to delete link",
        action: "deleteLink"
      });
    }
  },

  addCategory: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const tag = formData.get("tag");

    const categorySchema = z.object({
      tag: z.string().trim().min(1, { message: "Category name is required" }),
    });

    try {
      const { tag: validTag } = categorySchema.parse({ tag });

      await locals.DB.insert(shopCategoriesTable).values({
        tag: validTag,
      });

      return {
        success: true,
        action: "addCategory"
      };
    } catch (error) {
      console.error("Error adding category:", error);
      const message = error?.errors?.[0]?.message || "Failed to add category";
      const field = error?.errors?.[0]?.path?.[0];
      return fail(400, {
        message,
        field,
        action: "addCategory"
      });
    }
  },

  updateCategory: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const id = formData.get("id");
    const tag = formData.get("tag");

    const categorySchema = z.object({
      id: z.string().trim().min(1, { message: "Category ID is required" })
        .refine((val) => !Number.isNaN(parseInt(val, 10)), { message: "Invalid category ID" })
        .transform((val) => parseInt(val, 10)),
      tag: z.string().trim().min(1, { message: "Category name is required" }),
    });

    try {
      const { id: categoryId, tag: validTag } = categorySchema.parse({ id, tag });

      await locals.DB.update(shopCategoriesTable)
        .set({ tag: validTag })
        .where(eq(shopCategoriesTable.id, categoryId));

      return {
        success: true,
        action: "updateCategory"
      };
    } catch (error) {
      console.error("Error updating category:", error);
      const message = error?.errors?.[0]?.message || "Failed to update category";
      const field = error?.errors?.[0]?.path?.[0];
      return fail(400, {
        message,
        field,
        action: "updateCategory"
      });
    }
  },

  deleteCategory: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return fail(400, {
        message: "Category ID is required",
        action: "deleteCategory"
      });
    }

    try {
      await locals.DB.delete(shopCategoriesTable).where(eq(shopCategoriesTable.id, parseInt(id, 10)));
      return {
        success: true,
        action: "deleteCategory"
      };
    } catch (error) {
      console.error("Error deleting category:", error);
      return fail(500, {
        message: "Failed to delete category",
        action: "deleteCategory"
      });
    }
  },

  addSubcategory: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const category_id = formData.get("category_id");

    const subcategorySchema = z.object({
      name: z.string().trim().min(1, { message: "Subcategory name is required" }),
      category_id: z.string().trim().min(1, { message: "Category is required" })
        .refine((val) => !Number.isNaN(parseInt(val, 10)), { message: "Invalid category" })
        .transform((val) => parseInt(val, 10)),
    });

    try {
      const { name: validName, category_id: validCategoryId } = subcategorySchema.parse({
        name,
        category_id,
      });

      await locals.DB.insert(shopSubcategoriesTable).values({
        name: validName,
        category_id: validCategoryId,
      });

      return {
        success: true,
        action: "addSubcategory"
      };
    } catch (error) {
      console.error("Error adding subcategory:", error);
      const message = error?.errors?.[0]?.message || "Failed to add subcategory";
      const field = error?.errors?.[0]?.path?.[0];
      return fail(400, {
        message,
        field,
        action: "addSubcategory"
      });
    }
  },

  updateSubcategory: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const category_id = formData.get("category_id");

    const subcategorySchema = z.object({
      id: z.string().trim().min(1, { message: "Subcategory ID is required" })
        .refine((val) => !Number.isNaN(parseInt(val, 10)), { message: "Invalid subcategory ID" })
        .transform((val) => parseInt(val, 10)),
      name: z.string().trim().min(1, { message: "Subcategory name is required" }),
      category_id: z.string().trim().min(1, { message: "Category is required" })
        .refine((val) => !Number.isNaN(parseInt(val, 10)), { message: "Invalid category" })
        .transform((val) => parseInt(val, 10)),
    });

    try {
      const { id: subcategoryId, name: validName, category_id: validCategoryId } = subcategorySchema.parse({
        id,
        name,
        category_id,
      });

      await locals.DB.update(shopSubcategoriesTable)
        .set({
          name: validName,
          category_id: validCategoryId,
        })
        .where(eq(shopSubcategoriesTable.id, subcategoryId));

      return {
        success: true,
        action: "updateSubcategory"
      };
    } catch (error) {
      console.error("Error updating subcategory:", error);
      const message = error?.errors?.[0]?.message || "Failed to update subcategory";
      const field = error?.errors?.[0]?.path?.[0];
      return fail(400, {
        message,
        field,
        action: "updateSubcategory"
      });
    }
  },

  deleteSubcategory: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return fail(400, {
        message: "Subcategory ID is required",
        action: "deleteSubcategory"
      });
    }

    try {
      await locals.DB.delete(shopSubcategoriesTable).where(eq(shopSubcategoriesTable.id, parseInt(id, 10)));
      return {
        success: true,
        action: "deleteSubcategory"
      };
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      return fail(500, {
        message: "Failed to delete subcategory",
        action: "deleteSubcategory"
      });
    }
  },

  addItem: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    try {
      const formData = await request.formData();

      // Extract form fields
      const name = formData.get("name");
      const price = formData.get("price");
      const link = formData.get("link");
      const description = formData.get("description");
      const category_id = formData.get("category_id");
      const subcategory_id = formData.get("subcategory_id");

      console.log('[DEBUG] addItem form data received:', {
        name, price, link, description,
        category_id, subcategory_id
      });

      // Validate and parse all data
      const parsedData = addItemSchema.parse({
        name,
        price,
        link,
        description,
        category_id,
        subcategory_id,
      });
      const normalized = normalizeItemPayload(parsedData);
      const categoryId = parseInt(normalized.category_id, 10);

      // Insert into database
      const insertResult = await locals.DB.insert(shopItemsTable).values({
        name: normalized.name,
        price: normalized.price,
        link: normalized.link,
        description: normalized.description,
        category_id: categoryId,
        subcategory_id: normalized.subcategory_id,
      });

      console.log('[DEBUG] addItem DB insert completed:', {
        insertResult
      });

      return {
        success: true,
        action: "addItem"
      };
    } catch (error) {
      console.error("Error adding item:", error);
      const message = error?.errors?.[0]?.message || "Failed to add item";
      const field = error?.errors?.[0]?.path?.[0];
      return fail(400, {
        message,
        field,
        action: "addItem"
      });
    }
  },

  updateItem: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    try {
      const formData = await request.formData();

      // Extract form fields
      const id = formData.get("id");
      const name = formData.get("name");
      const price = formData.get("price");
      const link = formData.get("link");
      const description = formData.get("description");
      const category_id = formData.get("category_id");
      const subcategory_id = formData.get("subcategory_id");

      console.log('[DEBUG] updateItem form data received:', {
        id, name, price, link, description,
        category_id, subcategory_id
      });

      // Get existing item for comparison
      const existingItem = await locals.DB.query.shopItemsTable.findFirst({
        where: eq(shopItemsTable.id, parseInt(id, 10)),
      });

      if (!existingItem) {
        return fail(404, {
          message: "Item not found",
          action: "updateItem"
        });
      }

      // Validate and parse all data
      const parsedData = updateItemSchema.parse({
        id,
        name,
        price,
        link,
        description,
        category_id,
        subcategory_id,
      });
      const normalized = normalizeItemPayload(parsedData);
      const categoryId = parseInt(normalized.category_id, 10);

      // Update database
      await locals.DB.update(shopItemsTable)
        .set({
          name: normalized.name,
          price: normalized.price,
          link: normalized.link,
          description: normalized.description,
          category_id: categoryId,
          subcategory_id: normalized.subcategory_id
        })
        .where(eq(shopItemsTable.id, normalized.id));

      console.log('[DEBUG] updateItem DB update completed');

      return {
        success: true,
        action: "updateItem"
      };
    } catch (error) {
      console.error("Error updating item:", error);
      const message = error?.errors?.[0]?.message || "Failed to update item";
      const field = error?.errors?.[0]?.path?.[0];
      return fail(400, {
        message,
        field,
        action: "updateItem"
      });
    }
  },

  deleteItem: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return fail(400, {
        message: "Item ID is required",
        action: "deleteItem"
      });
    }

    try {
      const existingItem = await locals.DB.query.shopItemsTable.findFirst({
        where: eq(shopItemsTable.id, parseInt(id, 10)),
      });

      if (!existingItem) {
        return fail(404, {
          message: "Item not found",
          action: "deleteItem"
        });
      }

      await locals.DB.delete(shopItemsTable).where(eq(shopItemsTable.id, parseInt(id, 10)));

      return {
        success: true,
        action: "deleteItem"
      };
    } catch (error) {
      console.error("Error deleting item:", error);
      return fail(500, {
        message: "Failed to delete item",
        action: "deleteItem"
      });
    }
  },

  updatePassword: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    const passwordSchema = z.object({
      currentPassword: z.string().min(1, { message: "Current password is required" }),
      newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
      confirmPassword: z.string().min(1, { message: "Password confirmation is required" }),
    }).refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

    try {
      const { currentPassword: validCurrentPassword, newPassword: validNewPassword } = passwordSchema.parse({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Get user from database
      const user = await locals.DB.query.userTable.findFirst({
        where: eq(userTable.id, locals.user.id),
      });

      if (!user) {
        return fail(404, {
          message: "User not found",
          action: "updatePassword"
        });
      }

      // Verify current password
      const isValidPassword = await verifyPasswordHash(validCurrentPassword, user.password);
      if (!isValidPassword) {
        return fail(400, {
          message: "Current password is incorrect",
          field: "currentPassword",
          action: "updatePassword"
        });
      }

      // Hash new password
      const hashedNewPassword = await createPasswordHash(validNewPassword);

      // Update password in database
      await locals.DB.update(userTable)
        .set({ password: hashedNewPassword })
        .where(eq(userTable.id, locals.user.id));

      // Invalidate all sessions for this user (optional security measure)
      await locals.DB.delete(sessionTable)
        .where(eq(sessionTable.userId, locals.user.id));

      return {
        success: true,
        action: "updatePassword",
        message: "Password updated successfully. Please log in again."
      };
    } catch (error) {
      console.error("Error updating password:", error);
      const message = error?.errors?.[0]?.message || "Failed to update password";
      const field = error?.errors?.[0]?.path?.[0];
      return fail(400, {
        message,
        field,
        action: "updatePassword"
      });
    }
  },

  updateUsername: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const currentPassword = formData.get("currentPassword");
    const newUsername = formData.get("newUsername");

    const usernameSchema = z.object({
      currentPassword: z.string().min(1, { message: "Current password is required" }),
      newUsername: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(32, { message: "Username must be at most 32 characters" })
        .regex(/^[a-z0-9_-]+$/, { message: "Username can only contain lowercase letters, numbers, hyphens, and underscores" }),
    });

    try {
      const { currentPassword: validCurrentPassword, newUsername: validNewUsername } = usernameSchema.parse({
        currentPassword,
        newUsername,
      });

      // Get user from database
      const user = await locals.DB.query.userTable.findFirst({
        where: eq(userTable.id, locals.user.id),
      });

      if (!user) {
        return fail(404, {
          message: "User not found",
          action: "updateUsername"
        });
      }

      // Verify current password
      const isValidPassword = await verifyPasswordHash(validCurrentPassword, user.password);
      if (!isValidPassword) {
        return fail(400, {
          message: "Current password is incorrect",
          field: "currentPassword",
          action: "updateUsername"
        });
      }

      // Check if new username is already taken
      const existingUser = await locals.DB.query.userTable.findFirst({
        where: eq(userTable.username, validNewUsername),
      });

      if (existingUser && existingUser.id !== locals.user.id) {
        return fail(400, {
          message: "Username is already taken",
          field: "newUsername",
          action: "updateUsername"
        });
      }

      // Update username in database
      await locals.DB.update(userTable)
        .set({ username: validNewUsername })
        .where(eq(userTable.id, locals.user.id));

      // Invalidate all sessions for this user (force re-login with new username)
      await locals.DB.delete(sessionTable)
        .where(eq(sessionTable.userId, locals.user.id));

      return {
        success: true,
        action: "updateUsername",
        message: "Username updated successfully. Please log in again."
      };
    } catch (error) {
      console.error("Error updating username:", error);
      const message = error?.errors?.[0]?.message || "Failed to update username";
      const field = error?.errors?.[0]?.path?.[0];
      return fail(400, {
        message,
        field,
        action: "updateUsername"
      });
    }
  },
};