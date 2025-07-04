import React from 'react'
import { db } from '@/db'
import { forms } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { auth } from '@/auth'
import EditableForm from '../../EditableForm'
import Form from '../../Form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit3, Eye, Settings } from 'lucide-react'
import Link from 'next/link'

type Props = {}

const page = async ({params}:{
    params: { formId: string }
}) => {
    const formId = params.formId;
    const session = await auth();
    const userId = session?.user?.id;

    if(!formId) {
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
                            <p className="text-gray-600 mb-4">The form you're looking for doesn't exist.</p>
                            <Link href="/dashboard">
                                <Button>Return to Dashboard</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Check if user is authorized to view this form
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <Edit3 className="h-5 w-5 mr-2" />
                                    Edit Form
                                </h1>
                                <p className="text-sm text-gray-600">Make changes to your form</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link href={`/forms/${formId}`}>
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <EditableForm form={form} />
            </div>
        </div>
    )
}

export default page