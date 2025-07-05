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
      questions: prev.questions.map((q, idx) => 
        idx === questionIndex ? { ...q, [field]: value } : q
      )
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
    { value: 'Input', label: 'Text Input' },
    { value: 'Textarea', label: 'Textarea' },
    { value: 'Select', label: 'Select Dropdown' },
    { value: 'RadioGroup', label: 'Radio Group' },
    { value: 'Switch', label: 'Switch' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Edit Form</h1>
        
        {/* Form Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Form Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="form-name">Form Name</Label>
              <Input
                id="form-name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Enter form name"
              />
            </div>
            <div>
              <Label htmlFor="form-description">Form Description</Label>
              <Textarea
                id="form-description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Enter form description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Questions</h2>
            <Button onClick={addQuestion} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {formData.questions.map((question, questionIndex) => (
            <Card key={question.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`question-text-${questionIndex}`}>Question Text</Label>
                  <Input
                    id={`question-text-${questionIndex}`}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                    placeholder="Enter question text"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`question-type-${questionIndex}`}>Question Type</Label>
                  <Select
                    value={question.fieldType}
                    onValueChange={(value) => handleQuestionChange(questionIndex, 'fieldType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Options for Select and RadioGroup */}
                {(question.fieldType === 'Select' || question.fieldType === 'RadioGroup') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Options</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(questionIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                    
                    {question.fieldOptions.map((option, optionIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Input
                          value={option.text}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'text', e.target.value)}
                          placeholder="Option text"
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
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard')}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditableForm;
