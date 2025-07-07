import Header from "@/components/ui/header";
import LandingPage from './landing-page/page';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, BarChart3, Users, FileText } from 'lucide-react';

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center">
        {session?.user ? (
          // Authenticated user home page
          <div className="w-full max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Welcome back, {session.user.name?.split(' ')[0]}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Build professional forms and analyze responses with comprehensive business intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/form-generator">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Form
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="hover:bg-emerald-50 hover:border-emerald-200">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Quick stats or features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">Enterprise AI-Powered Forms</h3>
                <p className="text-emerald-700">Create intelligent forms with automated field selection and advanced validation</p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-teal-900 mb-2">Business Intelligence</h3>
                <p className="text-teal-700">Track responses and analyze data with enterprise-grade reporting tools</p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Professional Distribution</h3>
                <p className="text-slate-700">Share forms efficiently and collect responses with enterprise-grade security</p>
              </div>
            </div>
          </div>
        ) : (
          // Landing page for non-authenticated users
          <LandingPage />
        )}
      </main>
    </>
  )
}