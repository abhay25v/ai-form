import React from 'react'
import { Table } from './Table'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { forms } from '@/db/schema'

type Props = {
  formId: number
}

const ResultsDisplay = async ({ formId }: Props) => {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
    with: {
      questions: {
        with: {
          fieldOptions: true
        }
      },
      submissions: {
        with: {
          answers: {
            with: {
              fieldOptions: true
            }
          }
        }
      }
    }
  })

  if (!form) return null;
  if (!form.submissions || form.submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No submissions on this form yet!</p>
        <p className="text-sm text-gray-500 mt-2">
          Share your form to start collecting responses.
        </p>
      </div>
    );
  }
  
  console.log('form', form);
  return (
    <div>
      <Table
        data={form.submissions}
        columns={form.questions}
      />
    </div>
  )
}

export default ResultsDisplay
