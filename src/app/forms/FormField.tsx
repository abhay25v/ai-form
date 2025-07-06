import React, { ChangeEvent } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormControl, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { QuestionSelectModel } from '@/types/form-types';
import { FieldOptionSelectModel } from '@/types/form-types';
import { Label } from '@/components/ui/label';

type Props = {
  element: QuestionSelectModel & {
    fieldOptions: Array<FieldOptionSelectModel>
  }
  value?: string,
  onChange: (value: string) => void // Simplified onChange type
}

const FormField = ({ element, value, onChange }: Props) => {
  if (!element) return null;

  const components: Record<string, () => React.ReactElement> = {
    Input: () => (
      <Input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="text-base py-3 px-4 border-2 border-gray-200 focus:border-emerald-400 rounded-xl transition-colors"
        placeholder="Enter your answer..."
      />
    ),
    Switch: () => (
      <div className="flex items-center space-x-4 py-4">
        <div className="flex items-center space-x-3">
          <Switch 
            checked={value === 'true'} 
            onCheckedChange={(checked) => onChange(checked.toString())}
            className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-300"
          />
          <Label className="text-base font-medium text-gray-700">
            {value === 'true' ? 'Yes' : 'No'}
          </Label>
        </div>
        <div className="flex-1 text-sm text-gray-500">
          Toggle to {value === 'true' ? 'disable' : 'enable'}
        </div>
      </div>
    ),
    Textarea: () => (
      <Textarea 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="text-base py-3 px-4 border-2 border-gray-200 focus:border-emerald-400 rounded-xl transition-colors min-h-[120px] resize-none"
        placeholder="Enter your detailed response..."
      />
    ),
    Select: () => (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-base py-3 px-4 border-2 border-gray-200 focus:border-emerald-400 rounded-xl transition-colors">
          <SelectValue placeholder="Choose an option..." />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-0 shadow-lg">
          {element.fieldOptions?.map((option, index) => (
            <SelectItem 
              key={option.id || `${option.text}-${index}`} 
              value={`answerId_${option.id}`}
              className="text-base py-3 px-4 cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 rounded-lg mx-1"
            >
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    RadioGroup: () => (
      <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
        {element.fieldOptions?.map((option, index) => (
          <div key={option.id || `${option.text}-${index}`} className='flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer'>
            <RadioGroupItem 
              value={`answerId_${option.id}`} 
              id={`radio-${option.id || index}`}
              className="border-2 border-gray-300 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
            />
            <Label 
              htmlFor={`radio-${option.id || index}`} 
              className='text-base cursor-pointer flex-1 font-medium text-gray-700'
            >
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  }

  return element.fieldType && components[element.fieldType] ? components[element.fieldType]() : null;
}

export default FormField