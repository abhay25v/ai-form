import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PieChart, TrendingUp, Users, FileText, BarChart3 } from 'lucide-react'
import { InferSelectModel } from 'drizzle-orm'
import { forms } from '@/db/schema'

type Props = {
  forms: InferSelectModel<typeof forms>[]
}

const AdvancedAnalytics = ({ forms }: Props) => {
  // Calculate basic analytics data
  const totalForms = forms.length
  const publishedForms = forms.filter(form => form.published).length
  const draftForms = totalForms - publishedForms

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold">{totalForms}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published Forms</p>
                <p className="text-2xl font-bold">{publishedForms}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Forms</p>
                <p className="text-2xl font-bold">{draftForms}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Form Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {forms.length > 0 ? (
              <div className="space-y-4">
                {forms.slice(0, 5).map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{form.name}</p>
                      <p className="text-xs text-gray-600">
                        {form.published ? 'Published' : 'Draft'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          form.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {form.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {forms.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    And {forms.length - 5} more forms...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No forms to analyze yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Publishing Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Publishing Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Publish Rate</p>
                  <p className="text-xs text-gray-600">Percentage of forms published</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {totalForms > 0 ? Math.round((publishedForms / totalForms) * 100) : 0}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Published Forms</p>
                  <p className="text-xs text-gray-600">Forms available to users</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{publishedForms}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Draft Forms</p>
                  <p className="text-xs text-gray-600">Forms still in development</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{draftForms}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {publishedForms === 0 && totalForms > 0 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-blue-700">
                  You have {totalForms} unpublished forms. Consider publishing them to start collecting responses.
                </p>
              </div>
            )}
            
            {draftForms > 0 && publishedForms > 0 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm text-yellow-700">
                  You have {draftForms} draft forms. Review and publish them when ready.
                </p>
              </div>
            )}
            
            {publishedForms > 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-green-700">
                  Great job! You have {publishedForms} published forms. Check the Results tab to analyze responses.
                </p>
              </div>
            )}
            
            {totalForms === 0 && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <p className="text-sm text-gray-700">
                  Get started by creating your first form in the Forms tab.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdvancedAnalytics
