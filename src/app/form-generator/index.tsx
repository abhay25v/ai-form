"use client"
import { useState, useEffect } from 'react'
import React, { useActionState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { generateForm } from '../actions/generateForm';
import { useFormState, useFormStatus } from 'react-dom';
import { redirect } from 'next/navigation';

import { useSession, signIn, signOut } from "next-auth/react"

type Props = {}

const initialState: {
    message: string;
    data?: any;
} = {
    message: "",
}

export function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button 
            type="submit" 
            disabled={pending} 
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
            {pending ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span>🪄</span>
                    Create with AI
                </div>
            )}
        </Button>
    );
}

function FormGenerator(props: Props) {
    const [state, formAction] = useActionState(generateForm, initialState)
    const [open, setOpen] = useState(false);
    const session = useSession();
    console.log(session);

    useEffect(() => {
        if (state.message === "success") {
            setOpen(false);
            redirect(`/forms/edit/${state.data.formId}`); // Redirect to the form edit page with the new form ID
        }
        console.log(state);

    }, [state.message]);

    const onFormCreate = () => {
        if (session.data?.user) {
            setOpen(true);
        } else {
            signIn();
        }
    }

    return (
        <>
            <Button onClick={onFormCreate} size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 text-lg">
                    {/* <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-xs">✨</span>
                    </div> */}
                    Create Form
                </div>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
                    <DialogHeader className="text-center pb-4">
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Create New Form ✨
                        </DialogTitle>
                        <p className="text-gray-600 mt-2">Tell us about your form and let AI do the magic!</p>
                    </DialogHeader>
                    <form action={formAction}>
                        <div className='grid gap-6 py-4'>
                            <div className="relative">
                                <Textarea
                                    id='description'
                                    name='description'
                                    required
                                    placeholder='Example: Create a customer feedback form for my restaurant that collects ratings, comments, and contact information...'
                                    className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-emerald-400 rounded-xl p-4 text-gray-700 placeholder:text-gray-400"
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                    Be specific for better results
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-3 pt-4">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)} className="border-gray-200 hover:bg-gray-50">
                                Cancel
                            </Button>
                            <SubmitButton />
                            <Button variant="link" type="button" className="text-gray-500 hover:text-gray-700">
                                Create Manually
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FormGenerator