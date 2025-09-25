import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { userTable, sessionTable } from "$lib/server/db/schema";
import { verifyPasswordHash, createPasswordHash } from "$lib/server/password-hasher";

export const load = async ({ locals }) => {
  // Ensure user is logged in
  if (!locals.user) {
    return redirect(302, "/login");
  }
  
  return {};
};

export const actions = {
  updateUsername: async ({ request, locals, cookies }) => {
    // Ensure user is logged in
    if (!locals.user) {
      return fail(401, { 
        message: "Unauthorized",
        action: "updateUsername"
      });
    }

    const formData = await request.formData();
    const currentPassword = formData.get("currentPassword");
    const newUsername = formData.get("newUsername");

    // Validate inputs
    const schema = z.object({
      currentPassword: z.string().min(1, { message: "Current password is required" }),
      newUsername: z.string().min(1, { message: "New username is required" })
    });

    try {
      schema.parse({ currentPassword, newUsername });
    } catch (error) {
      return fail(400, {
        message: error.errors[0]?.message || "Invalid input",
        action: "updateUsername"
      });
    }

    // Get user from database
    const user = await locals.DB.query.userTable.findFirst({
      where: eq(userTable.id, locals.user.id),
    });

    if (!user) {
      return fail(400, {
        message: "User not found",
        action: "updateUsername"
      });
    }

    // Verify current password
    const validPassword = await verifyPasswordHash(currentPassword, user.password);
    if (!validPassword) {
      return fail(400, {
        message: "Current password is incorrect",
        action: "updateUsername"
      });
    }

    try {
      // Update username
      await locals.DB.update(userTable)
        .set({ username: newUsername })
        .where(eq(userTable.id, locals.user.id));

      // Delete all existing sessions for this user for security
      await locals.DB.delete(sessionTable)
        .where(eq(sessionTable.userId, locals.user.id));

      // Invalidate the current session cookie
      const lucia = locals.lucia;
      lucia.invalidateUserSessions(locals.user.id);
      
      // Clear the session cookie
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });

      // Return success (will be displayed before client-side redirect)
      return {
        success: true,
        message: "Username changed successfully. You will be redirected to login in a few seconds.",
        action: "updateUsername",
        redirectTo: "/login?message=Username changed successfully. Please login again."
      };
    } catch (error) {
      console.error('Error updating username:', error);
      return fail(500, {
        message: "Failed to update username",
        action: "updateUsername"
      });
    }
  },

  updatePassword: async ({ request, locals, cookies }) => {
    // Ensure user is logged in
    if (!locals.user) {
      return fail(401, { 
        message: "Unauthorized",
        action: "updatePassword"
      });
    }

    const formData = await request.formData();
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    // Validate inputs
    const schema = z.object({
      currentPassword: z.string().min(1, { message: "Current password is required" }),
      newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
      confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
    });

    try {
      schema.parse({ currentPassword, newPassword, confirmPassword });
    } catch (error) {
      return fail(400, {
        message: error.errors[0]?.message || "Invalid input",
        action: "updatePassword"
      });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return fail(400, {
        message: "New passwords don't match",
        action: "updatePassword"
      });
    }

    // Get user from database
    const user = await locals.DB.query.userTable.findFirst({
      where: eq(userTable.id, locals.user.id),
    });

    if (!user) {
      return fail(400, {
        message: "User not found",
        action: "updatePassword"
      });
    }

    // Verify current password
    const validPassword = await verifyPasswordHash(currentPassword, user.password);
    if (!validPassword) {
      return fail(400, {
        message: "Current password is incorrect",
        action: "updatePassword"
      });
    }

    try {
      // Hash the new password
      const hashedPassword = await createPasswordHash(newPassword);

      // Update user with new password
      await locals.DB.update(userTable)
        .set({ password: hashedPassword })
        .where(eq(userTable.id, locals.user.id));

      // Delete all existing sessions for this user for security
      await locals.DB.delete(sessionTable)
        .where(eq(sessionTable.userId, locals.user.id));

      // Invalidate the current session cookie
      const lucia = locals.lucia;
      lucia.invalidateUserSessions(locals.user.id);
      
      // Clear the session cookie
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });

      // Return success (will be displayed before client-side redirect)
      return {
        success: true,
        message: "Password changed successfully. You will be redirected to login in a few seconds.",
        action: "updatePassword",
        redirectTo: "/login?message=Password changed successfully. Please login again."
      };
    } catch (error) {
      console.error('Error updating password:', error);
      return fail(500, {
        message: "Failed to update password",
        action: "updatePassword"
      });
    }
  }
};