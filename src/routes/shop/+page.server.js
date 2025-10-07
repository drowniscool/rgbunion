import { shopCategoriesTable, shopItemsTable, shopSubcategoriesTable } from "$lib/server/db/schema";

export const load = async ({ locals }) => {
  const [categories, subcategories, rawItems] = await Promise.all([
    locals.DB.select().from(shopCategoriesTable),
    locals.DB.select().from(shopSubcategoriesTable),
    locals.DB.select().from(shopItemsTable)
  ]);

  // Group items by category and subcategory for easier rendering
  const itemsByCategory = rawItems.reduce((acc, item) => {
    if (!acc[item.category_id]) {
      acc[item.category_id] = {
        items: [],
        subcategories: {}
      };
    }
    
    // Add item to category's items array
    acc[item.category_id].items.push(item);
    
    // If item has a subcategory, add it to the subcategory group
    if (item.subcategory_id) {
      if (!acc[item.category_id].subcategories[item.subcategory_id]) {
        acc[item.category_id].subcategories[item.subcategory_id] = [];
      }
      acc[item.category_id].subcategories[item.subcategory_id].push(item);
    }
    
    return acc;
  }, {});

  return {
    categories,
    subcategories,
    itemsByCategory
  };
};