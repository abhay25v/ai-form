import React, { ChangeEvent, useState } from 'react'
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
import { CheckCircle, Type, AlignLeft, List, ToggleLeft, ChevronDown } from 'lucide-react';

type Props = {
  element: QuestionSelectModel & {
    fieldOptions: Array<FieldOptionSelectModel>
  }
  value?: string,
  onChange: (value: string) => void
}

const FormField = ({ element, value, onChange }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  
  if (!element) return null;

  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case 'Input': return <Type className="w-4 h-4" />;
      case 'Textarea': return <AlignLeft className="w-4 h-4" />;
      case 'Select': return <List className="w-4 h-4" />;
      case 'RadioGroup': return <CheckCircle className="w-4 h-4" />;
      case 'Switch': return <ToggleLeft className="w-4 h-4" />;
      default: return null;
    }
  };

  const components: Record<string, () => React.ReactElement> = {
    Input: () => (
      <div className="space-y-2">
        <div className="relative group">
          <Input 
            type="text" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              text-base py-4 px-5 border-2 rounded-xl transition-all duration-200 
              bg-white/50 backdrop-blur-sm min-h-[56px]
              ${isFocused || value ? 
                'border-emerald-400 shadow-lg shadow-emerald-100' : 
                'border-gray-200 hover:border-gray-300'
              }
              focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500
            `}
            placeholder="Type your answer here..."
          />
          <div className={`
            absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-200
            ${value ? 'text-emerald-500' : 'text-gray-400'}
          `}>
            {getFieldIcon('Input')}
          </div>
        </div>
        {value && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 animate-in slide-in-from-top-1 duration-200">
            <CheckCircle className="w-4 h-4" />
            <span>Answer recorded</span>
          </div>
        )}
      </div>
    ),
    
    Switch: () => (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
          <div className="flex items-center space-x-4">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
              ${value === 'true' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}
            `}>
              {getFieldIcon('Switch')}
            </div>
            <div>
              <Label className="text-lg font-semibold text-gray-900 cursor-pointer">
                {value === 'true' ? 'Enabled' : 'Disabled'}
              </Label>
              <p className="text-sm text-gray-600">
                {value === 'true' ? 'Currently activated' : 'Currently deactivated'}
              </p>
            </div>
          </div>
          <Switch 
            checked={value === 'true'} 
            onCheckedChange={(checked) => onChange(checked.toString())}
            className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-300 scale-125"
          />
        </div>
        {value && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 animate-in slide-in-from-top-1 duration-200">
            <CheckCircle className="w-4 h-4" />
            <span>Selection confirmed</span>
          </div>
        )}
      </div>
    ),
    
    Textarea: () => (
      <div className="space-y-2">
        <div className="relative group">
          <Textarea 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              text-base py-4 px-5 border-2 rounded-xl transition-all duration-200 
              bg-white/50 backdrop-blur-sm min-h-[140px] resize-none
              ${isFocused || value ? 
                'border-emerald-400 shadow-lg shadow-emerald-100' : 
                'border-gray-200 hover:border-gray-300'
              }
              focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500
            `}
            placeholder="Share your detailed thoughts here..."
          />
          <div className={`
            absolute right-4 top-4 transition-all duration-200
            ${value ? 'text-emerald-500' : 'text-gray-400'}
          `}>
            {getFieldIcon('Textarea')}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{value ? `${value.length} characters` : 'No limit'}</span>
          {value && (
            <div className="flex items-center gap-1 text-emerald-600">
              <CheckCircle className="w-3 h-3" />
              <span>Response saved</span>
            </div>
          )}
        </div>
      </div>
    ),
    
    Select: () => (
      <div className="space-y-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={`
            text-base py-4 px-5 border-2 rounded-xl transition-all duration-200 
            bg-white/50 backdrop-blur-sm min-h-[56px] group
            ${value ? 
              'border-emerald-400 shadow-lg shadow-emerald-100' : 
              'border-gray-200 hover:border-gray-300'
            }
            focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500
          `}>
            <div className="flex items-center gap-3 w-full">
              <div className={`
                transition-all duration-200
                ${value ? 'text-emerald-500' : 'text-gray-400'}
              `}>
                {getFieldIcon('Select')}
              </div>
              <SelectValue placeholder="Select your choice..." className="flex-1 text-left" />
              <ChevronDown className="w-4 h-4 text-gray-400 group-data-[state=open]:rotate-180 transition-transform duration-200" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            {element.fieldOptions?.map((option, index) => (
              <SelectItem 
                key={option.id || `${option.text}-${index}`} 
                value={`answerId_${option.id}`}
                className="text-base py-4 px-5 cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 rounded-lg mx-2 my-1 transition-all duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>{option.text}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {value && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 animate-in slide-in-from-top-1 duration-200">
            <CheckCircle className="w-4 h-4" />
            <span>Option selected</span>
          </div>
        )}
      </div>
    ),
    
    RadioGroup: () => (
      <div className="space-y-3">
        <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
          {element.fieldOptions?.map((option, index) => (
            <div 
              key={option.id || `${option.text}-${index}`} 
              className={`
                group flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer
                ${value === `answerId_${option.id}` ? 
                  'border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-100' : 
                  'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                }
              `}
            >
              <RadioGroupItem 
                value={`answerId_${option.id}`} 
                id={`radio-${option.id || index}`}
                className="border-2 border-gray-300 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600 w-5 h-5"
              />
              <Label 
                htmlFor={`radio-${option.id || index}`} 
                className='text-base cursor-pointer flex-1 font-medium text-gray-700 group-hover:text-gray-900 transition-colors'
              >
                {option.text}
              </Label>
              {value === `answerId_${option.id}` && (
                <CheckCircle className="w-5 h-5 text-emerald-600 animate-in zoom-in-50 duration-200" />
              )}
            </div>
          ))}
        </RadioGroup>
        {value && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 animate-in slide-in-from-top-1 duration-200">
            <CheckCircle className="w-4 h-4" />
            <span>Choice confirmed</span>
          </div>
        )}
      </div>
    )
  }

  return element.fieldType && components[element.fieldType] ? components[element.fieldType]() : null;
}

export default FormField