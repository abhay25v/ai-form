"use client";
import React, { useState } from 'react'
import { FormSelectModel, QuestionSelectModel, FieldOptionSelectModel } from '@/types/form-types'
import { Form as FormComponent, FormField as ShadcdnFormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import FormField from './FormField';
import { publishForm } from '../actions/mutateForm';
import FormPublishSuccess from './FormPublishSuccess';
import { useRouter } from 'next/navigation';

type Props = {
  form: Form,
  editMode?: boolean
}

type QuestionWithOptionsModel = QuestionSelectModel & {
  fieldOptions: Array<FieldOptionSelectModel>
}

interface Form extends FormSelectModel {
  questions: Array<QuestionWithOptionsModel>
}

const Form = (props: Props) => {
  const form = useForm();
  const router = useRouter();
  const { editMode } = props;
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleDialogChange = (open: boolean) => {
    setSuccessDialogOpen(open);
  }

  const onSubmit = async (data: any) => {
    console.log(data);
    if (editMode) {
      await publishForm(props.form.id);
      setSuccessDialogOpen(true);
    } else {
      let answers = [];
      for (const [questionId, value] of Object.entries(data)) {
        const id = parseInt(questionId.replace('question_', ''));
        let fieldOptionsId = null;
        let textValue = null;

        if (typeof value == "string" && value.includes('answerId_')) {
          fieldOptionsId = parseInt(value.replace('answerId_', ''));
        } else {
          textValue = value as string;
        }

        answers.push({
          questionId: id,
          fieldOptionsId,
          value: textValue
        })
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/form/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formId: props.form.id, answers })
      });
      if (response.status === 200) {
        router.push(`/forms/${props.form.id}/success`);
      } else {
        console.error('Error submitting form');
        alert('Error submitting form. Please try again later');
      }
    }
  }


  return (
    <div className='w-full'>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="max-w-4xl mx-auto relative">
            <div className="flex items-start justify-between">
              <div>
                <h1 className='text-4xl font-bold mb-4 leading-tight'>{props.form.name}</h1>
                <p className='text-emerald-100 text-xl leading-relaxed max-w-3xl'>{props.form.description}</p>
              </div>
              {editMode && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-emerald-100 text-sm">
                  <span className="font-semibold">Preview Mode</span>
                </div>
              )}
            </div>
            {!editMode && (
              <div className="mt-6 flex items-center gap-4 text-emerald-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>~{Math.ceil(props.form.questions.length * 0.5)} min to complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{props.form.questions.length} question{props.form.questions.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Form Content */}
        <div className="px-8 py-10">
          <div className="max-w-4xl mx-auto">
            <FormComponent {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10'>
                {props.form.questions.map((question: QuestionWithOptionsModel, index: number) => {
                  return (
                    <ShadcdnFormField
                      control={form.control}
                      name={`question_${question.id}`}
                      key={`${question.text}_${index}`}
                      render={({ field }) => (
                        <FormItem className="space-y-6">
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-200">
                            <FormLabel className='text-xl font-semibold text-gray-900 mb-6 block leading-relaxed'>
                              <div className="flex items-start gap-4">
                                <span className="inline-flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full text-lg font-bold flex-shrink-0 mt-1">
                                  {index + 1}
                                </span>
                                <span className="flex-1">{question.text}</span>
                                {question.fieldType !== 'Switch' && (
                                  <span className="text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full">
                                    {question.fieldType === 'Input' ? 'Text' : 
                                     question.fieldType === 'Textarea' ? 'Long Text' :
                                     question.fieldType === 'Select' ? 'Dropdown' :
                                     question.fieldType === 'RadioGroup' ? 'Multiple Choice' :
                                     question.fieldType}
                                  </span>
                                )}
                              </div>
                            </FormLabel>
                            <FormControl>
                              <div className="pl-14">
                                <FormField element={question} key={index} value={field.value} onChange={field.onChange} />
                              </div>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                })}
                
                {/* Submit Button */}
                <div className="pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <Button 
                      type='submit' 
                      size="lg" 
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {editMode ? (
                        <div className="flex items-center gap-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Publish Form
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Submit Response
                        </div>
                      )}
                    </Button>
                    {!editMode && (
                      <p className="text-gray-500 text-sm mt-4">
                        Your response will be recorded securely
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </FormComponent>
          </div>
        </div>
      </div>
      <FormPublishSuccess formId={props.form.id} open={successDialogOpen} onOpenChange={handleDialogChange} />
    </div>
  )
}

export default Form