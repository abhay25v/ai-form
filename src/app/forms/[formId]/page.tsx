import React from 'react'
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import Form from '../Form';
import Header from '@/components/ui/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const page = async ({ params }: {
  params: {
    formId: string
  }
}) => {
  // Await params before accessing its properties
  const { formId } = params;

  if (!formId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600">The form you&apos;re looking for doesn&apos;t exist.</p>
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
          <p className="text-gray-600">The form you&apos;re looking for doesn&apos;t exist.</p>
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
      <Header session={session}/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-stone-50">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b">
          <div className="w-full max-w-7xl mx-auto py-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Form Preview</span>
              </div>
              {form.userId === userId && (
                <div className="flex items-center space-x-2">
                  <Link href={`/forms/edit/${form.id}`}>
                    <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-200">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Form
                    </Button>
                  </Link>
                  <Link href={`/forms/results/${form.id}`}>
                    <Button variant="outline" size="sm" className="hover:bg-teal-50 hover:border-teal-200">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Results
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto py-8 px-4">
          <Form form={form} />
        </div>
      </div>
    </>
  )
}

export default page;