import React from 'react'
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Users, FileText } from 'lucide-react';

const ResultsPage = async ({ params }: {
  params: Promise<{
    formId: string
  }>
}) => {
  const { formId } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need to be logged in to view form results.</p>
        </div>
      </div>
    )
  }

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

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, parsedFormId),
    with: {
      questions: {
        with: {
          fieldOptions: true
        }
      },
      submissions: {
        with: {
          answers: {
            with: {
              question: true,
              fieldOptions: true
            }
          }
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

  // Check if user owns the form
  if (form.userId !== userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You can only view results for forms you created.</p>
        </div>
      </div>
    )
  }

  const totalSubmissions = form.submissions?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.name}</h1>
          <p className="text-gray-600">{form.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{form.questions?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {form.published ? (
                  <span className="text-green-600">Published</span>
                ) : (
                  <span className="text-gray-500">Draft</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Content */}
        {totalSubmissions > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Form Responses</CardTitle>
              <CardDescription>
                View and analyze responses to your form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {form.submissions?.map((submission, index) => (
                  <div key={submission.id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Response #{index + 1}</h3>
                    <div className="space-y-2">
                      {submission.answers?.map((answer) => (
                        <div key={answer.id} className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-700">
                            {answer.question?.text}
                          </span>
                          <span className="text-gray-900">{answer.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No responses yet
              </h3>
              <p className="text-gray-600 mb-4">
                Share your form to start collecting responses
              </p>
              <div className="flex justify-center gap-4">
                <Link href={`/forms/edit/${form.id}`}>
                  <Button variant="outline">Edit Form</Button>
                </Link>
                <Link href={`/forms/${form.id}`}>
                  <Button>View Form</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ResultsPage
