import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart3, TrendingUp, FileText } from 'lucide-react'
import { InferSelectModel } from 'drizzle-orm'
import { forms } from '@/db/schema'
import FormsPicker from './FormsPicker'
import ResultsDisplay from './ResultsDisplay'

type Props = {
  forms: InferSelectModel<typeof forms>[]
  selectedFormId?: number
}

const ResultsAnalytics = ({ forms, selectedFormId }: Props) => {
  if (!forms?.length || forms.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No forms found
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first form to start collecting responses and viewing analytics.
          </p>
        </CardContent>
      </Card>
    )
  }

  const selectOptions = forms.map((form) => {
    return {
      label: form.name,
      value: form.id
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Form Results & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <FormsPicker options={selectOptions} />
            <ResultsDisplay formId={selectedFormId || forms[0].id} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResultsAnalytics
