import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Plus, FileText, Share2, BarChart3, Users, Eye } from 'lucide-react'
import FormGenerator from '../../form-generator'
import { InferSelectModel } from 'drizzle-orm'
import { forms } from '@/db/schema'

type Props = {
  forms: InferSelectModel<typeof forms>[]
}

const DashboardOverview = ({ forms }: Props) => {
  const publishedForms = forms.filter(form => form.published)
  const totalResponses = 0 // TODO: Calculate from submissions

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.length}</div>
            <p className="text-xs text-muted-foreground">
              Forms created
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedForms.length}</div>
            <p className="text-xs text-muted-foreground">
              Live forms
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              Submissions received
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormGenerator />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forms.length > 0 ? (
                forms.slice(0, 5).map((form) => (
                  <div key={form.id} className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {form.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {form.published ? 'Published' : 'Draft'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {form.published && <Eye className="h-4 w-4 text-green-600" />}
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No forms created yet. Create your first form above!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Create form with AI</span>
                <Plus className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">View all forms</span>
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Check responses</span>
                <BarChart3 className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Share forms</span>
                <Share2 className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardOverview
