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

  const components: Record<string, () => React.ReactElement> = { // Changed JSX.Element to React.ReactElement
    Input: () => (
      <Input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
      />
    ),
    Switch: () => (
      <Switch 
        checked={value === 'true'} 
        onCheckedChange={(checked) => onChange(checked.toString())} 
      />
    ),
    Textarea: () => (
      <Textarea 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
      />
    ),
    Select: () => (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {element.fieldOptions?.map((option, index) => (
            <SelectItem 
              key={option.id || `${option.text}-${index}`} 
              value={`answerId_${option.id}`}
            >
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    RadioGroup: () => (
      <RadioGroup value={value} onValueChange={onChange}>
        {element.fieldOptions?.map((option, index) => (
          <div key={option.id || `${option.text}-${index}`} className='flex items-center space-x-2'>
            <RadioGroupItem 
              value={`answerId_${option.id}`} 
              id={`radio-${option.id || index}`} 
            />
            <Label 
              htmlFor={`radio-${option.id || index}`} 
              className='text-base cursor-pointer'
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