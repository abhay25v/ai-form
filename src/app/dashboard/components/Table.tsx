"use client";
import * as React from 'react'
import { InferSelectModel } from 'drizzle-orm';
import { forms, answers, formSubmissions, questions, fieldOptions } from '@/db/schema';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

type FieldOption = InferSelectModel<typeof fieldOptions>

type Answer = InferSelectModel<typeof answers> & {
  fieldOptions?: FieldOption | null
}

type Question = InferSelectModel<typeof questions> & { fieldOptions: FieldOption[] }

type FormSubmission = InferSelectModel<typeof formSubmissions> & {
  answers: Answer[]
}

export type Form = InferSelectModel<typeof forms> & {
  questions: Question[]
  submissions: FormSubmission[]
} | undefined

interface TableProps {
  data: FormSubmission[]
  columns: Question[]
}

const columnHelper = createColumnHelper<FormSubmission>()

export function Table(props: TableProps) {
  const { data } = props
  const columns = [
    columnHelper.accessor('id', {
      cell: info => info.getValue(),
      header: () => 'ID',
    }),
    ...props.columns.map((question: Question) => {
      return columnHelper.accessor((row: FormSubmission) => {
        const answer = row.answers.find((answer: Answer) => {
          return answer.questionId === question.id;
        });

        return answer?.fieldOptions ? answer.fieldOptions.text : answer?.value;
      }, {
        header: () => question.text,
        id: question.id.toString(),
        cell: info => info.renderValue(),
      })
    })
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2 mt-4">
      <div className='shadow overflow-hidden border border-gray-200 sm:rounded-lg'>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className='hover:bg-gray-50'>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
