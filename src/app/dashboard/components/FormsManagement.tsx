import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Plus, FileText } from 'lucide-react'
import FormGenerator from '../../form-generator'
import FormsList from '../../forms/FormsList'
import { InferSelectModel } from 'drizzle-orm'
import { forms } from '@/db/schema'

type Props = {
  forms: InferSelectModel<typeof forms>[]
}

const FormsManagement = ({ forms }: Props) => {
  return (
    <div className="space-y-8">
      {/* Create New Form Section */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Plus className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Create New Form</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormGenerator />
        </CardContent>
      </Card>

      {/* Your Forms Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FileText className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Forms</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {forms.length} {forms.length === 1 ? 'form' : 'forms'}
          </span>
        </div>
        {forms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormsList forms={forms} />
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No forms yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by creating your first form above. Our AI will help you build it in seconds!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default FormsManagement
