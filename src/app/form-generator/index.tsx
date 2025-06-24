"use client"
import { useState, useEffect } from 'react'
import React, {useActionState} from 'react'
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

import {useSession, signIn, signOut} from "next-auth/react"

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
        <Button type="submit" disabled={pending} className="ml-2">
            {pending ? "Creating..." : "Create"}
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
        } 
        console.log(state);
        
    }, [state.message]);

    const onFormCreate = () => {
        setOpen(true);
    }

    return (
        <>
            <Button onClick={onFormCreate}>
                Create Form
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create new form</DialogTitle>
                    </DialogHeader>
                    <form action={formAction}>
                        <div className='grid gap-4 py-4'>
                            <Textarea
                                id='description'
                                name='description'
                                required
                                placeholder='Share what your form is about, who is it for, and what information you would like to collect. And AI will do the magic!🪄'
                            />
                        </div>
                        <DialogFooter>
                            <SubmitButton />
                            <Button variant="link" type="button">Create Manually</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FormGenerator