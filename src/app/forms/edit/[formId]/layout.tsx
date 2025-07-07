import React from 'react'

type Props = {
    children: React.ReactNode
}

const FormEditLayout = ({ children }: Props) => {
    return (
        <div className='min-h-screen flex flex-col'>
            {children}
        </div>
    )
}

export default FormEditLayout