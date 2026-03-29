"use server";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { hasGuestTrialForm, markGuestTrialFormCreated } from "@/lib/guestFormTrial";

export async function createManualForm() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId && hasGuestTrialForm()) {
    return {
      success: false,
      error: "You already used your free guest trial. Sign in to create more forms.",
      requiresAuth: true,
    };
  }

  try {
    const newForm = await db
      .insert(forms)
      .values({
        name: "New Form",
        description: "Enter a description for your form to help respondents understand its purpose",
        userId: userId ?? null,
        published: false,
      })
      .returning({ insertedId: forms.id });

    const formId = newForm[0].insertedId;

    if (!userId) {
      markGuestTrialFormCreated(formId);
    }

    revalidatePath("/dashboard");
    return { success: true, formId };
  } catch (error) {
    console.error("Error creating manual form:", error);
    return { success: false, error: "Failed to create form" };
  }
}
