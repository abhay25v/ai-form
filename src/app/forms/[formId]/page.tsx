import React from 'react'
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import Form from '../Form';
import Header from '@/components/ui/header';

const page = async ({ params }: {
  params: Promise<{
    formId: string
  }>
}) => {
  // Await params before accessing its properties
  const { formId } = await params;

  if (!formId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600">The form you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Parse and validate the formId
  const parsedFormId = parseInt(formId, 10);
  
  if (isNaN(parsedFormId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Form ID</h1>
          <p className="text-gray-600">The form ID provided is not valid.</p>
        </div>
      </div>
    )
  }

  const session = await auth();
  const userId = session?.user?.id;

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, parsedFormId),
    with: {
      questions: {
        with: {
          fieldOptions: true
        }
      }
    }
  })

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600">The form you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Check if user can access this form
  const canAccess = form.published || form.userId === userId;

  if (!canAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Available</h1>
          <p className="text-gray-600">
            This form is not published yet. Only the form creator can view it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-stone-50">
        <div className="max-w-5xl mx-auto py-12 px-4">
          <Form form={form} />
        </div>
      </div>
    </>
  )
}

export default page;