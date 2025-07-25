"use client"
import { useState, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { generateForm } from '../actions/generateForm';
import { createManualForm } from '../actions/createManualForm';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useSession, signIn } from "next-auth/react"

const initialState: {
    message: string;
    data?: { formId?: string | number } | undefined;
} = {
    message: "",
}

export function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium px-8 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
            {pending ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating Form...
                </div>
            ) : (
                "Generate with AI"
            )}
        </Button>
    );
}

function FormGenerator() {
    const [state, formAction] = useFormState(generateForm, initialState)
    const [open, setOpen] = useState(false);
    const [isCreatingManual, setIsCreatingManual] = useState(false);
    const session = useSession();
    const router = useRouter();

    // Timer states for AI generation
    const [timer, setTimer] = useState(99);
    const [showLongWait, setShowLongWait] = useState(false);
    const [aiPending, setAiPending] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (aiPending) {
            setTimer(99);
            setShowLongWait(false);
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev > 0) return prev - 1;
                    else {
                        setShowLongWait(true);
                        return 0;
                    }
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [aiPending]);

    useEffect(() => {
        if (state.message === "success") {
            setAiPending(false);
            setShowLongWait(false);
            setTimer(99);
            setOpen(false);
            redirect(`/forms/edit/${state.data?.formId}`); // Redirect to the form edit page with the new form ID
        } else if (state.message) {
            setAiPending(false);
            setShowLongWait(false);
            setTimer(99);
        }
    }, [state.message, state.data?.formId]);

    const onFormCreate = () => {
        if (session.data?.user) {
            setOpen(true);
        } else {
            signIn();
        }
    }

    const onCreateManually = async () => {
        if (!session.data?.user) {
            signIn();
            return;
        }

        setIsCreatingManual(true);
        try {
            const result = await createManualForm();
            if (result.success) {
                setOpen(false);
                router.push(`/forms/edit/${result.formId}`);
            } else {
                alert('Failed to create form. Please try again.');
            }
        } catch (error) {
            console.error('Error creating manual form:', error);
            alert('Error creating form. Please try again.');
        } finally {
            setIsCreatingManual(false);
        }
    }

    return (
        <>
            <Button onClick={onFormCreate} size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 text-base">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Form
                </div>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px] border-0 shadow-2xl">
                    <DialogHeader className="text-center pb-6">
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Create New Form
                        </DialogTitle>
                        <p className="text-gray-600 mt-2">Choose your preferred creation method</p>
                    </DialogHeader>

                    {/* AI Creation Option */}
                    <form action={formAction} onSubmit={() => setAiPending(true)}>
                        <div className='grid gap-6 py-4'>
                            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-emerald-900 mb-2">
                                            AI-Assisted Creation
                                        </h3>
                                        <p className="text-sm text-emerald-700 mb-4">
                                            Describe your requirements and our AI will generate a complete form with appropriate field types and options.
                                        </p>
                                        <div className="relative">
                                            <Textarea
                                                id='description'
                                                name='description'
                                                required
                                                placeholder='Describe your form requirements: purpose, target audience, and specific fields needed...'
                                                className="min-h-[100px] resize-none border-2 border-emerald-200 focus:border-emerald-400 rounded-lg p-4 text-gray-700 placeholder:text-gray-500"
                                            />
                                            <div className="absolute bottom-3 right-3 text-xs text-emerald-600 font-medium">
                                                Detailed descriptions yield better results
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Timer and status */}
                        {aiPending && (
                            <div className="flex flex-col items-center py-4">
                                {!showLongWait ? (
                                    <div className="text-emerald-700 font-medium">
                                        Generating your form... <span className="font-mono">{timer}s</span>
                                    </div>
                                ) : (
                                    <div className="text-orange-600 font-medium">
                                        Taking a little longer than usual... Please wait.
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-4">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)} className="border-gray-300 hover:bg-gray-50">
                                Cancel
                            </Button>
                            <SubmitButton />
                        </div>
                    </form>

                    {/* Manual Creation Option */}
                    <div className="border-t pt-6 mt-6">
                        <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 mb-2">
                                        Manual Builder
                                    </h3>
                                    <p className="text-sm text-slate-700 mb-4">
                                        Build your form from scratch with complete control over structure, field types, and validation rules.
                                    </p>
                                    <Button
                                        type="button"
                                        onClick={onCreateManually}
                                        disabled={isCreatingManual}
                                        className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium"
                                    >
                                        {isCreatingManual ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Creating Form...
                                            </div>
                                        ) : (
                                            "Start Building"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FormGenerator