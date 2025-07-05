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
    <div className="space-y-6">
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

      {/* Your Forms Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Forms</h2>
        {forms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormsList forms={forms} />
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No forms yet
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first form above
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default FormsManagement
