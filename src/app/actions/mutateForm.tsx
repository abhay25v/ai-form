"use server"

import { db } from "@/db";
import { forms, questions as dbQuestions, fieldOptions, questions } from "@/db/schema";
import { auth } from "@/auth";

export async function saveForm(data) {
    const { name, description, questions } = data;
    const session = await auth();
    const userId = session?.user?.id;

    const newForm = await db.insert(forms).values({
        name,
        description,
        userId,
        published: false, // default to false
    }).returning({ insertId: forms.id });
    const formId = newForm[0].insertId;
    return formId;

    //TODO
    // const questionInserts = questions.map((question) => ({
    //     text: question.text,
    //     fieldType: question.fieldType,
    //     formId: formId,
    // }));
    // const insertedQuestions = await db.insert(dbQuestions).values(questionInserts).returning({insertId: dbQuestions.id});
    // const questionIds = insertedQuestions.map(q => q.insertId);
    // const fieldOptionInserts = [];
    // questions.forEach((question, index) => {
    //     if (question.fieldType === "select" || question.fieldType === "checkbox") {
    //         question.options.forEach((option) => {
    //             fieldOptionInserts.push({
    //                 text: option.text,
    //                 value: option.value,
    //                 questionId: questionIds[index],
    //             });
    //         });
    //     }
    // }
}