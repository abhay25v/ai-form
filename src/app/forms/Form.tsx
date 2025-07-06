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
    <div className='max-w-4xl mx-auto px-6'>
      <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-8 text-white">
          <h1 className='text-3xl font-bold mb-3'>{props.form.name}</h1>
          <p className='text-emerald-100 text-lg leading-relaxed'>{props.form.description}</p>
        </div>
        
        {/* Form Content */}
        <div className="px-8 py-8">
          <FormComponent {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              {props.form.questions.map((question: QuestionWithOptionsModel, index: number) => {
                return (
                  <ShadcdnFormField
                    control={form.control}
                    name={`question_${question.id}`}
                    key={`${question.text}_${index}`}
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <FormLabel className='text-lg font-semibold text-gray-900 mb-4 block'>
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-600 text-white rounded-full text-sm font-bold mr-3">
                              {index + 1}
                            </span>
                            {question.text}
                          </FormLabel>
                          <FormControl>
                            <FormField element={question} key={index} value={field.value} onChange={field.onChange} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                )
              })}
              
              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <Button 
                  type='submit' 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {editMode ? (
                    <div className="flex items-center gap-2">
                      <span>🚀</span>
                      Publish Form
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>📝</span>
                      Submit Response
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </FormComponent>
        </div>
      </div>
      <FormPublishSuccess formId={props.form.id} open={successDialogOpen} onOpenChange={handleDialogChange} />
    </div>
  )
}

export default Form