import React from 'react'
import { db } from '@/db'
import { forms } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { auth } from '@/auth'
import Form from '../../Form'


type Props = {}

const page = async ({params}:{
    params: { formId: string }
}) => {
    const formId = params.formId;
    const session = await auth();
    const userId = session?.user?.id; // Fixed: Added '=' operator

    if(!formId) {
        return <div>Form ID not found</div>;
    }

    const form = await db.query.forms.findFirst({
        where: eq(forms.id, parseInt(formId)),
        with: {
            questions: {
                with: {
                    fieldOptions: true
                }
            }
        }
    });

    if (!form) {
        return <div>Form not found</div>;
    }

    // Check if user is authorized to view this form
    if (form.userId !== userId) {
        return <div>You are not authorized to view this form</div>;
    }

    console.log("form", form);
    console.log("userId", userId);

    return (
        <div>
            <Form form={form} />
        </div>
    )
}

export default page