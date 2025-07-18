"use server";

import { db } from "@/db";
import { forms, questions as dbQuestions, fieldOptions } from "@/db/schema";
import { auth } from "@/auth";
import { InferInsertModel, eq } from "drizzle-orm";

type Form = InferInsertModel<typeof forms>;
type Question = InferInsertModel<typeof dbQuestions>;
type FieldOption = InferInsertModel<typeof fieldOptions>;

interface SaveFormData extends Form {
  questions: Array<Question & { fieldOptions?: FieldOption[] }>;
}

export async function saveForm(data: SaveFormData) {
  const { name, description, questions } = data;
  const session = await auth();
  const userId = session?.user?.id;

  const newForm = await db
    .insert(forms)
    .values({
      name,
      description,
      userId,
      published: false,
    })
    .returning({ insertedId: forms.id });
  const formId = newForm[0].insertedId;

  const newQuestions = data.questions.map((question) => {
    return {
      text: question.text,
      fieldType: question.fieldType,
      fieldOptions: question.fieldOptions,
      formId,
    };
  });

  await db.transaction(async (tx) => {
    for (const question of newQuestions) {
      const [{ questionId }] = await tx
        .insert(dbQuestions)
        .values(question)
        .returning({ questionId: dbQuestions.id });
      if (question.fieldOptions && question.fieldOptions.length > 0) {
        await tx.insert(fieldOptions).values(
          question.fieldOptions.map((option) => ({
            text: option.text,
            value: option.value,
            questionId,
          }))
        );
      }
    }
  });

  return formId;
}

export async function publishForm(formId: number) {
  await db.update(forms).set({ published: true }).where(eq(forms.id, formId));
}

export async function updateForm(formId: number, data: SaveFormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // First, verify the user owns this form
  const existingForm = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
  });

  if (!existingForm || existingForm.userId !== userId) {
    throw new Error("Not authorized to update this form");
  }

  await db.transaction(async (tx) => {
    // Update form details
    await tx
      .update(forms)
      .set({
        name: data.name,
        description: data.description,
      })
      .where(eq(forms.id, formId));

    // Delete existing questions and options
    const existingQuestions = await tx
      .select({ id: dbQuestions.id })
      .from(dbQuestions)
      .where(eq(dbQuestions.formId, formId));
    
    for (const question of existingQuestions) {
      await tx.delete(fieldOptions).where(eq(fieldOptions.questionId, question.id));
    }
    
    await tx.delete(dbQuestions).where(eq(dbQuestions.formId, formId));

    // Insert new questions and options
    for (const question of data.questions) {
      const [{ questionId }] = await tx
        .insert(dbQuestions)
        .values({
          text: question.text,
          fieldType: question.fieldType,
          formId,
        })
        .returning({ questionId: dbQuestions.id });

      if (question.fieldOptions && question.fieldOptions.length > 0) {
        await tx.insert(fieldOptions).values(
          question.fieldOptions.map((option) => ({
            text: option.text,
            value: option.value,
            questionId,
          }))
        );
      }
    }
  });

  return formId;
}