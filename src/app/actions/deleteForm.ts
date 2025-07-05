"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { forms } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteForm(formId: number) {
  const session = await auth();
  const userId = session?.user?.id;
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify the form belongs to the user
    const form = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
    });

    if (!form || form.userId !== userId) {
      throw new Error("Form not found or unauthorized");
    }

    // Delete the form
    await db.delete(forms).where(eq(forms.id, formId));

    // Revalidate the forms page to update the UI
    revalidatePath("/dashboard");
    
    return { success: true, message: "Form deleted successfully" };
  } catch (error) {
    console.error("Error deleting form:", error);
    throw new Error("Failed to delete form");
  }
}
