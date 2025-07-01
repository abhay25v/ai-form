import React from 'react'
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import Form from '../Form';

const page = async ({ params }: {
  params: Promise<{
    formId: string
  }>
}) => {
  // Await params before accessing its properties
  const { formId } = await params;

  if (!formId) {
    return <div>Form not found</div>
  }

  // Parse and validate the formId
  const parsedFormId = parseInt(formId, 10);
  
  if (isNaN(parsedFormId)) {
    return <div>Invalid form ID</div>
  }

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, parsedFormId), // Use the validated parsedFormId
    with: {
      questions: {
        with: {
          fieldOptions: true
        }
      }
    }
  })

  if (!form) {
    return <div>Form not found</div>
  }

  return (
    <Form form={form} />
  )
}

export default page;