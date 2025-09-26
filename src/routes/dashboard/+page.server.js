import { eq } from "drizzle-orm";
import { websitesTable, shopCategoriesTable, shopItemsTable, shopSubcategoriesTable } from "$lib/server/db/schema";
import { error, fail, redirect } from "@sveltejs/kit";
import { z } from "zod";

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
      linkSchema.parse({ url, title, description });
    } catch (error) {
      return fail(400, {
        message: error.errors[0]?.message || "Invalid input",
        values: { url, title, description },
        action: "addLink"
      });
    }

    try {
      // Insert new link to database
      await locals.DB.insert(websitesTable).values({
        link: url,
        title,
        description: description || "",
        user_id: locals.user.id,
      });

      return { 
        success: true,
        action: "addLink"
      };
    } catch (err) {
      console.error("Error adding link:", err);
      return fail(500, { 
        message: "Failed to add link",
        action: "addLink"
      });
    }
  },

  updateLink: async ({ locals, request }) => {
    // Check if user is authenticated
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const id = formData.get("id");
    const url = formData.get("url");
    const title = formData.get("title");
    const description = formData.get("description");

    const updateSchema = z.object({
      id: z.string().trim().min(1),
      url: z.string().trim().url({ message: "Please enter a valid URL" }),
      title: z.string().trim().min(1, { message: "Title is required" }),
      description: z.string().trim().optional(),
    });

    try {
      updateSchema.parse({ id, url, title, description });
    } catch (error) {
      return fail(400, {
        message: error.errors[0]?.message || "Invalid input",
        action: "updateLink"
      });
    }

    try {
      await locals.DB.update(websitesTable)
        .set({
          link: url,
          title,
          description: description || "",
        })
        .where(eq(websitesTable.id, id));

      return { 
        success: true,
        action: "updateLink"
      };
    } catch (err) {
      console.error("Error updating link:", err);
      return fail(500, { 
        message: "Failed to update link",
        action: "updateLink"
      });
    }
  },

  deleteLink: async ({ locals, request }) => {
    // Check if user is authenticated
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
      // Check if link exists and belongs to user
      const existingLink = await locals.DB.query.websitesTable.findFirst({
        where: (websitesTable, { eq, and }) => and(eq(websitesTable.id, id), eq(websitesTable.user_id, locals.user.id)),
      });

      if (!existingLink) {
        return fail(404, { message: "Link not found" });
      }

      // Delete the link
      await locals.DB.delete(websitesTable).where(eq(websitesTable.id, id));

      return { 
        success: true,
        action: "deleteLink"
      };
    } catch (err) {
      console.error("Error deleting link:", err);
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
    const subcategory_names = formData.getAll("subcategory_names[]");

    const schema = z.object({
      tag: z.string().trim().min(1, { message: "Category tag is required" }),
      subcategory_names: z.array(z.string()).optional(),
    });

    try {
      schema.parse({ tag, subcategory_names });

      // Check if category already exists
      const existingCategory = await locals.DB.select()
        .from(shopCategoriesTable)
        .where(eq(shopCategoriesTable.tag, tag))
        .limit(1);

      if (existingCategory.length > 0) {
        return fail(400, {
          message: "A category with this tag already exists",
          action: "addCategory",
          values: { tag }
        });
      }

      // Insert the category
      const [newCategory] = await locals.DB.insert(shopCategoriesTable)
        .values({ tag })
        .returning();

      // If subcategory names are provided, create the subcategories
      if (subcategory_names?.length > 0) {
        const validSubcategories = subcategory_names
          .map(name => name.trim())
          .filter(name => name.length > 0);

        if (validSubcategories.length > 0) {
          await locals.DB.insert(shopSubcategoriesTable)
            .values(
              validSubcategories.map(name => ({
                name,
                category_id: newCategory.id
              }))
            );
        }
      }

      return { 
        success: true,
        action: "addCategory"
      };
    } catch (err) {
      console.error("Error adding category:", err);
      return fail(500, { 
        message: "Failed to add category", 
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

    const schema = z.object({
      id: z.string().trim().min(1),
      tag: z.string().trim().min(1, { message: "Category tag is required" }),
    });

    try {
      schema.parse({ id, tag });

      // Check if new tag conflicts with existing categories
      const existingCategory = await locals.DB.select()
        .from(shopCategoriesTable)
        .where(eq(shopCategoriesTable.tag, tag))
        .limit(1);

      if (existingCategory.length > 0 && existingCategory[0].id !== parseInt(id)) {
        return fail(400, {
          message: "A category with this tag already exists",
          action: "updateCategory",
          values: { tag }
        });
      }

      await locals.DB.update(shopCategoriesTable)
        .set({ tag })
        .where(eq(shopCategoriesTable.id, id));

      return { 
        success: true,
        action: "updateCategory"
      };
    } catch (err) {
      console.error("Error updating category:", err);
      return fail(500, { 
        message: "Failed to update category", 
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
      // Delete all items in the category first
      await locals.DB.delete(shopItemsTable)
        .where(eq(shopItemsTable.category_id, id));

      // Then delete the category
      await locals.DB.delete(shopCategoriesTable)
        .where(eq(shopCategoriesTable.id, id));

      return { 
        success: true,
        action: "deleteCategory"
      };
    } catch (err) {
      console.error("Error deleting category:", err);
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

    const schema = z.object({
      name: z.string().trim().min(1, { message: "Subcategory name is required" }),
      category_id: z.string().trim().min(1, { message: "Category is required" }),
    });

    try {
      schema.parse({ name, category_id });

      await locals.DB.insert(shopSubcategoriesTable).values({
        name,
        category_id: parseInt(category_id)
      });

      return { 
        success: true,
        action: "addSubcategory"
      };
    } catch (err) {
      console.error("Error adding subcategory:", err);
      return fail(500, { 
        message: "Failed to add subcategory", 
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

    const schema = z.object({
      id: z.string().trim().min(1),
      name: z.string().trim().min(1, { message: "Subcategory name is required" }),
      category_id: z.string().trim().min(1, { message: "Category is required" }),
    });

    try {
      schema.parse({ id, name, category_id });

      await locals.DB.update(shopSubcategoriesTable)
        .set({
          name,
          category_id: parseInt(category_id)
        })
        .where(eq(shopSubcategoriesTable.id, id));

      return { 
        success: true,
        action: "updateSubcategory"
      };
    } catch (err) {
      console.error("Error updating subcategory:", err);
      return fail(500, { 
        message: "Failed to update subcategory", 
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
      // Update items to remove subcategory reference
      await locals.DB.update(shopItemsTable)
        .set({ subcategory_id: null })
        .where(eq(shopItemsTable.subcategory_id, id));

      // Delete the subcategory
      await locals.DB.delete(shopSubcategoriesTable)
        .where(eq(shopSubcategoriesTable.id, id));

      return { 
        success: true,
        action: "deleteSubcategory"
      };
    } catch (err) {
      console.error("Error deleting subcategory:", err);
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

    const formData = await request.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const link = formData.get("link");
    const category_id = formData.get("category_id");
    const subcategory_id = formData.get("subcategory_id");

    const schema = z.object({
      name: z.string().trim().min(1, { message: "Item name is required" }),
      price: z.string().trim().min(1, { message: "Price is required" })
        .transform(val => Math.round(parseFloat(val) * 100)), // Convert to cents
      link: z.string().trim().url({ message: "Please enter a valid URL" }),
      category_id: z.string().trim().min(1, { message: "Category is required" }),
      subcategory_id: z.string().optional().transform(val => val ? parseInt(val) : null),
    });

    try {
      const validData = schema.parse({ name, price, link, category_id, subcategory_id });
      
      await locals.DB.insert(shopItemsTable).values({
        name: validData.name,
        price: validData.price,
        link: validData.link,
        category_id: validData.category_id,
        subcategory_id: validData.subcategory_id
      });

      return { 
        success: true,
        action: "addItem"
      };
    } catch (error) {
      console.error("Error adding item:", error);
      return fail(400, {
        message: error.errors?.[0]?.message || "Failed to add item",
        action: "addItem"
      });
    }
  },

  updateItem: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const price = formData.get("price");
    const link = formData.get("link");
    const category_id = formData.get("category_id");
    const subcategory_id = formData.get("subcategory_id");

    const schema = z.object({
      id: z.string().trim().min(1),
      name: z.string().trim().min(1, { message: "Item name is required" }),
      price: z.string().trim().min(1, { message: "Price is required" })
        .transform(val => Math.round(parseFloat(val) * 100)), // Convert to cents
      link: z.string().trim().url({ message: "Please enter a valid URL" }),
      category_id: z.string().trim().min(1, { message: "Category is required" }),
      subcategory_id: z.string().optional().transform(val => val ? parseInt(val) : null),
    });

    try {
      const validData = schema.parse({ id, name, price, link, category_id, subcategory_id });
      
      await locals.DB.update(shopItemsTable)
        .set({
          name: validData.name,
          price: validData.price,
          link: validData.link,
          category_id: validData.category_id,
          subcategory_id: validData.subcategory_id
        })
        .where(eq(shopItemsTable.id, id));

      return { 
        success: true,
        action: "updateItem"
      };
    } catch (error) {
      console.error("Error updating item:", error);
      return fail(400, {
        message: error.errors?.[0]?.message || "Failed to update item",
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
      await locals.DB.delete(shopItemsTable)
        .where(eq(shopItemsTable.id, id));

      return { 
        success: true,
        action: "deleteItem"
      };
    } catch (err) {
      console.error("Error deleting item:", err);
      return fail(500, { 
        message: "Failed to delete item", 
        action: "deleteItem" 
      });
    }
  },
};
