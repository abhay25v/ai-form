"use client";
import React, { useState } from 'react';
import { FormSelectModel, QuestionSelectModel, FieldOptionSelectModel } from '@/types/form-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, GripVertical, Save, X } from 'lucide-react';
import { updateForm } from '../actions/mutateForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  form: Form;
}

type QuestionWithOptionsModel = QuestionSelectModel & {
  fieldOptions: Array<FieldOptionSelectModel>
}

interface Form extends FormSelectModel {
  questions: Array<QuestionWithOptionsModel>
}

const EditableForm = (props: Props) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: props.form.name || '',
    description: props.form.description || '',
    questions: props.form.questions.map(q => ({
      id: q.id,
      text: q.text || '',
      fieldType: q.fieldType,
      formId: q.formId,
      fieldOptions: q.fieldOptions || []
    }))
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (questionIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) => {
        if (idx === questionIndex) {
          const updatedQuestion = { ...q, [field]: value };
          
          // If changing to Select or RadioGroup and no options exist, add default options
          if (field === 'fieldType' && (value === 'Select' || value === 'RadioGroup') && q.fieldOptions.length === 0) {
            updatedQuestion.fieldOptions = [
              { id: Date.now(), text: 'Option 1', value: 'option1', questionId: q.id },
              { id: Date.now() + 1, text: 'Option 2', value: 'option2', questionId: q.id }
            ];
          }
          
          // If changing away from Select or RadioGroup, clear options
          if (field === 'fieldType' && value !== 'Select' && value !== 'RadioGroup') {
            updatedQuestion.fieldOptions = [];
          }
          
          return updatedQuestion;
        }
        return q;
      })
    }));
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIdx) => 
        qIdx === questionIndex 
          ? {
              ...q,
              fieldOptions: q.fieldOptions.map((opt, optIdx) => 
                optIdx === optionIndex ? { ...opt, [field]: value } : opt
              )
            }
          : q
      )
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(), // temporary ID
      text: '',
      fieldType: 'Input' as const,
      formId: props.form.id,
      fieldOptions: []
    };
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const removeQuestion = (questionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== questionIndex)
    }));
  };

  const addOption = (questionIndex: number) => {
    const newOption = {
      id: Date.now(), // temporary ID
      text: '',
      value: '',
      questionId: formData.questions[questionIndex]?.id || 0
    };

    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) => 
        idx === questionIndex 
          ? { ...q, fieldOptions: [...q.fieldOptions, newOption] }
          : q
      )
    }));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) => 
        idx === questionIndex 
          ? { ...q, fieldOptions: q.fieldOptions.filter((_, optIdx) => optIdx !== optionIndex) }
          : q
      )
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateForm(props.form.id, formData);
      toast.success('Form updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating form:', error);
      toast.error('Error updating form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldTypeOptions = [
    { value: 'Input', label: 'Text Input', description: 'Single line text field' },
    { value: 'Textarea', label: 'Textarea', description: 'Multi-line text field' },
    { value: 'Select', label: 'Select Dropdown', description: 'Dropdown menu with options' },
    { value: 'RadioGroup', label: 'Radio Group', description: 'Single choice from multiple options' },
    { value: 'Switch', label: 'Switch', description: 'Yes/No toggle switch' }
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Edit Form</h1>
        
        {/* Welcome Message for New Forms */}
        {formData.questions.length === 0 && (
          <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
            <h2 className="text-lg font-semibold text-emerald-900 mb-2">Professional Form Builder</h2>
            <p className="text-emerald-700 mb-4">
              Create your form by adding essential information and questions. Configure field types, 
              validation rules, and response options to match your business requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-emerald-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Configure form details</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Add questions and fields</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Deploy and analyze</span>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {formData.questions.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Form Completion</h3>
              <span className="text-sm text-gray-500">
                {formData.name && formData.description && formData.questions.length > 0 ? 'Ready to publish' : 'In progress'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, 
                      (formData.name ? 30 : 0) + 
                      (formData.description ? 20 : 0) + 
                      (formData.questions.length > 0 ? 50 : 0)
                    )}%` 
                  }}
                ></div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Complete all sections to publish
              </div>
            </div>
          </div>
        )}
        
        {/* Form Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Form Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="form-name" className="text-sm font-medium text-gray-700">Form Title *</Label>
                <Input
                  id="form-name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Enter a clear, descriptive title for your form"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="form-description" className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea
                  id="form-description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Provide context and instructions for form respondents"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Questions & Fields</h2>
              {formData.questions.length > 0 && (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {formData.questions.length} field{formData.questions.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <Button onClick={addQuestion} size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>

          {formData.questions.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No fields added yet</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Add your first form field to start collecting responses. Choose from various input types 
                  including text, dropdowns, radio buttons, and toggles.
                </p>
                <Button onClick={addQuestion} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Field
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {formData.questions.map((question, questionIndex) => (
                <Card key={question.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-teal-600 text-white rounded-full text-sm font-bold">
                          {questionIndex + 1}
                        </span>
                        Field {questionIndex + 1}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor={`question-text-${questionIndex}`} className="text-sm font-medium text-gray-700">Field Label *</Label>
                        <Input
                          id={`question-text-${questionIndex}`}
                          value={question.text}
                          onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                          placeholder="Enter the field label or question text"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`question-type-${questionIndex}`} className="text-sm font-medium text-gray-700">Field Type</Label>
                        <Select
                          value={question.fieldType}
                          onValueChange={(value) => handleQuestionChange(questionIndex, 'fieldType', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{option.label}</span>
                                  <span className="text-xs text-gray-500">{option.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Options for Select and RadioGroup */}
                    {(question.fieldType === 'Select' || question.fieldType === 'RadioGroup') && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-gray-700">Field Options</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(questionIndex)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          {question.fieldOptions.map((option, optionIndex) => (
                            <div key={option.id} className="flex items-center gap-3">
                              <span className="text-sm text-gray-500 w-8">{optionIndex + 1}.</span>
                              <Input
                                value={option.text}
                                onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'text', e.target.value)}
                                placeholder="Option label"
                                className="flex-1"
                              />
                              <Input
                                value={option.value}
                                onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'value', e.target.value)}
                                placeholder="Option value"
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(questionIndex, optionIndex)}
                                className="text-red-500 hover:text-red-700 flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t bg-white sticky bottom-0 shadow-lg rounded-lg px-4 py-4 z-40">
          <div className="text-sm text-gray-600">
            {formData.questions.length === 0 ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Add at least one field to save your form
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {formData.questions.length} field{formData.questions.length !== 1 ? 's' : ''} configured
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              disabled={isLoading}
              className="hover:bg-gray-50"
            >
              Cancel
            </Button>
            {formData.questions.length > 0 && (
              <Button 
                variant="outline"
                onClick={() => router.push(`/forms/${props.form.id}`)}
                disabled={isLoading}
                className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
              >
                Preview Form
              </Button>
            )}
            <Button 
              onClick={handleSave} 
              disabled={isLoading || formData.questions.length === 0} 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Form
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableForm;
