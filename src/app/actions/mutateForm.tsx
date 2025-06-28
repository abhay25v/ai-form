"use server"

import { db } from "@/db";
import { forms, fieldOptions, questions as dbQuestions } from "@/db/schema";
import { auth } from "@/auth";
import { InferInsertModel } from "drizzle-orm";

type Form = InferInsertModel<typeof forms>;
type Question = InferInsertModel<typeof dbQuestions>;
type FieldOption = InferInsertModel<typeof fieldOptions>;

interface SaveFormData extends Form {
    questions: Array<Question & {
        fieldOptions?: Array<FieldOption>;
    }>
}

export async function saveForm(data: SaveFormData) {
    const { name, description, questions: formQuestions } = data;
    const session = await auth();
    const userId = session?.user?.id;

    const newForm = await db.insert(forms).values({
        name,
        description,
        userId,
        published: false, // default to false
    }).returning({ insertId: forms.id });

    const formId = newForm[0].insertId;

    await db.transaction(async (tx) => {
        // Iterate over original formQuestions to access fieldOptions
        for (const question of formQuestions) {
            const [{ questionId }] = await tx.insert(dbQuestions).values({
                text: question.text,
                fieldType: question.fieldType,
                formId,
            }).returning({ questionId: dbQuestions.id });

            // Check if this question has fieldOptions
            if (question.fieldOptions && question.fieldOptions.length > 0) {
                // Create array of options to insert
                const optionsToInsert = question.fieldOptions.map((option: any) => ({
                    text: option.text,
                    value: option.value,
                    questionId,
                }));
                
                // Insert all options for this question
                await tx.insert(fieldOptions).values(optionsToInsert);
            }
        }
    });

    return formId;
}