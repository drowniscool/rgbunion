import { websitesTable } from '$lib/server/db/schema.js';

export const load = async ({ locals }) => {
  try {
    // Load all shop links from websitesTable for public display
    const links = await locals.DB.select().from(websitesTable);

    return {
      links: links || [],
      user: locals.user || null,
      loggedIn: !!locals.user
    };
  } catch (error) {
    console.error('Error loading shop links:', error);
    return {
      links: [],
      user: locals.user || null,
      loggedIn: !!locals.user
    };
  }
};
