"use server";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleFormPublish(formId: number, published: boolean) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user owns the form
    const form = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
    });

    if (!form || form.userId !== userId) {
      return { success: false, error: "Form not found or unauthorized" };
    }

    // Update the form
    await db
      .update(forms)
      .set({ published })
      .where(eq(forms.id, formId));

    revalidatePath("/");
    revalidatePath(`/forms/${formId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error toggling form publish status:", error);
    return { success: false, error: "Failed to update form" };
  }
}
