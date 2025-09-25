import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { userTable } from "$lib/server/db/schema";
import { verifyPasswordHash, createPasswordHash } from "$lib/server/password-hasher";
import { z } from "zod";

export const load = async ({ locals, url }) => {
  if (locals.user) return redirect(302, `/admin`);
  
  // Get success message from URL if any
  const message = url.searchParams.get('message');
  
  return {
    message
  };
};

export const actions = {
  default: async ({ request, locals, cookies }) => {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    const schema = z.object({
      username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(32, { message: "Username must be at most 32 characters" })
        .regex(/^[a-z0-9_-]+$/, { message: "Invalid username" }),
      password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(255, { message: "Password must be at most 255 characters" }),
    });

    try {
      schema.parse({ username, password });
    } catch (error) {
      return fail(400, {
        // @ts-ignore
        message: error.errors[0]?.message,
      });
    }

    const existingUser = await locals.DB.query.userTable.findFirst({
      where: eq(userTable.username, username),
    });

    if (!existingUser) {
      return fail(400, {
        message: "Incorrect username or password",
      });
    }

    const validPassword = await verifyPasswordHash(password, existingUser.password);
    if (!validPassword) {
      return fail(400, {
        message: "Incorrect username or password",
      });
    }
    const lucia = locals.lucia;
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    return redirect(302, `/admin`);
  },
};
