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

const Dashboard = async ({ searchParams }: {
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
}) => {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }
  
  const forms = await getUserForms()

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to your Dashboard, {session?.user?.name}!
        </h1>
        <p className="text-gray-600">
          Create, manage, and analyze your forms with powerful insights
        </p>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="forms" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Forms
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
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
            selectedFormId={searchParams?.formId ? parseInt(searchParams.formId as string) : undefined}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <AdvancedAnalytics forms={forms} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard
