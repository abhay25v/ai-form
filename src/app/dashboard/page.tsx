import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserForms } from '../actions/getUserForms'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, BarChart3, TrendingUp, PieChart } from 'lucide-react'
import DashboardOverview from './components/DashboardOverview'
import FormsManagement from './components/FormsManagement'
import ResultsAnalytics from './components/ResultsAnalytics'
import AdvancedAnalytics from './components/AdvancedAnalytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/ui/header'

const Dashboard = async ({ searchParams }: {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) => {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }
  
  const forms = await getUserForms()

  return (
    <>
      <Header session={session}/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-stone-50">
        <div className="w-full px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-10 max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-0 shadow-sm">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent mb-3">
              Welcome back, {session?.user?.name}!
            </h1>
            <p className="text-lg text-gray-600">
              Create, manage, and analyze your forms with comprehensive business intelligence
            </p>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all">
              <FileText className="h-4 w-4" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2 data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-all">
              <TrendingUp className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-slate-500 data-[state=active]:text-white transition-all">
              <PieChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <DashboardOverview forms={forms} />
        </TabsContent>

        <TabsContent value="forms" className="space-y-6 mt-6">
          <FormsManagement forms={forms} />
        </TabsContent>

        <TabsContent value="results" className="space-y-6 mt-6">
          <ResultsAnalytics 
            forms={forms} 
            selectedFormId={resolvedSearchParams.formId ? parseInt(resolvedSearchParams.formId as string) : undefined}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <AdvancedAnalytics forms={forms} />
        </TabsContent>
      </Tabs>
      </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
