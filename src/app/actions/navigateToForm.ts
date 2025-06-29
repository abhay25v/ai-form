'use server'
import { redirect } from 'next/navigation';

export async function navigateToForm(formId: number) {
    // Redirect to the form edit page with the specified form ID
    redirect(`/forms/edit/${formId}`);
}