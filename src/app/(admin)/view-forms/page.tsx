import React from 'react'
import FormsList from '@/app/forms/FormsList';
import { getUserForms } from '@/app/actions/getUserForms';
import { InferSelectModel } from 'drizzle-orm';
import {forms as dbForms} from '@/db/schema';


type Props = {}

const page = async (props: Props) => {
    const forms: InferSelectModel<typeof dbForms>[] = await getUserForms();
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-4'>Your Forms</h1>
      <FormsList forms={forms} />
    </div>
  )
}

export default page