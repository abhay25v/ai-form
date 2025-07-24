import React from 'react'
import { db } from '@/db'
import { forms } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import EditableForm from '../../EditableForm'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit3, Eye, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/ui/header'

const page = async ({ params }: { params: { formId: string } }) => {
    const {formId} = await params;
    const session = await auth();
    const userId = session?.user?.id;

    if (!formId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Form ID not found</h2>
                            <p className="text-gray-600 mb-4">The form ID is missing from the URL.</p>
                            <Link href="/dashboard">
                                <Button>Return to Dashboard</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
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
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Form not found</h2>
                            <p className="text-gray-600 mb-4">The form you&apos;re looking for doesn&apos;t exist.</p>
                            <Link href="/dashboard">
                                <Button>Return to Dashboard</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (form.userId !== userId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Unauthorized</h2>
                            <p className="text-gray-600 mb-4">You are not authorized to edit this form.</p>
                            <Link href="/dashboard">
                                <Button>Return to Dashboard</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <Header session={session} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-stone-50">
                {/* Sub Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm border-b">
                    <div className="w-full px-4 py-6">
                        <div className="flex items-center justify-between max-w-5xl mx-auto">
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Dashboard
                                    </Button>
                                </Link>
                                <div className="h-6 w-px bg-gray-300"></div>
                                <div>
                                    <h1 className="text-2xl font-bold text-emerald-700 flex items-center">
                                        <Edit3 className="h-6 w-6 mr-2 text-emerald-600" />
                                        Edit Form
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">Configure your form fields and settings</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link href={`/forms/${formId}`}>
                                    <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Preview
                                    </Button>
                                </Link>
                                <Link href={`/forms/results/${formId}`}>
                                    <Button variant="outline" size="sm" className="hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700">
                                        <BarChart3 className="h-4 w-4 mr-2" />
                                        Results
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full flex justify-center px-2 py-10">
                    <div className="w-full max-w-4xl">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Builder</h2>
                            <hr className="mb-6" />
                            <EditableForm form={form} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page