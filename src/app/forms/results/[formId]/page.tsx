import React from 'react'
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Users, FileText } from 'lucide-react';
import Header from '@/components/ui/header';

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
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-stone-50">
        <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Total Responses</CardTitle>
              <div className="p-2 bg-emerald-200 rounded-lg">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{totalSubmissions}</div>
              <p className="text-emerald-600 text-sm mt-1">
                {totalSubmissions === 0 ? 'No responses yet' : totalSubmissions === 1 ? 'response collected' : 'responses collected'}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Questions</CardTitle>
              <div className="p-2 bg-orange-200 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{form.questions?.length || 0}</div>
              <p className="text-orange-600 text-sm mt-1">
                {(form.questions?.length || 0) === 1 ? 'question in form' : 'questions in form'}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Status</CardTitle>
              <div className="p-2 bg-teal-200 rounded-lg">
                <BarChart3 className="h-5 w-5 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {form.published ? (
                  <span className="text-teal-700 flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
                    Published
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    Draft
                  </span>
                )}
              </div>
              <p className="text-teal-600 text-sm mt-1">
                {form.published ? 'Accepting responses' : 'Not accepting responses'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results Content */}
        {totalSubmissions > 0 ? (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
              <CardTitle className="text-xl text-gray-900">Form Responses</CardTitle>
              <CardDescription>
                View and analyze all {totalSubmissions} responses in a structured table format
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        Response #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        Submitted At
                      </th>
                      {form.questions?.map((question) => (
                        <th key={question.id} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[200px]">
                          <div className="truncate" title={question.text || ''}>
                            {question.text}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {form.submissions?.map((submission, index) => (
                      <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-100">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border-r border-gray-100">
                          {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </td>
                        {form.questions?.map((question) => {
                          const answer = submission.answers?.find(a => a.questionId === question.id);
                          return (
                            <td key={question.id} className="px-6 py-4 text-sm text-gray-900 border-r border-gray-100">
                              <div className="max-w-xs">
                                {answer ? (
                                  <div className="break-words">
                                    {answer.fieldOptions
                                      ? answer.fieldOptions.text 
                                      : answer.value || '-'
                                    }
                                  </div>
                                ) : (
                                  <span className="text-gray-400 italic">No response</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer with Summary */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Total Responses: <span className="font-semibold text-gray-900">{totalSubmissions}</span></span>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-200">
                      Export CSV
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-teal-50 hover:border-teal-200">
                      Download PDF
                    </Button>
                  </div>
                </div>
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
    </>
  )
}

export default ResultsPage
