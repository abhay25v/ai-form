import { auth } from '@/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home, FileText } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/ui/header'
import React from 'react'

export default async function SuccessPage() {
  const session = await auth();

  return (
    <>
      <Header session={session} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Response Submitted Successfully!</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Thank you for taking the time to complete our form. Your response has been recorded securely and will be reviewed by our team.
              </p>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 text-emerald-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Your information is secure and confidential</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" className="hover:bg-emerald-50 hover:border-emerald-200">
                  <Home className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <FileText className="w-4 h-4 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}