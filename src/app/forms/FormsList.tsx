import React from "react";
import { forms } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Form = InferSelectModel<typeof forms>;

type Props = {
    forms: Form[];
}

const FormsList = (props: Props) => {
    return (
        <div>{props.forms.map((form: Form) => (
            <Card key={form.id} className="w-96">
                <CardHeader>
                    <CardTitle>{form.name}</CardTitle>
                    <CardDescription>{form.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link className="w-full" href={`/forms/edit/${form.id}`}>
                        <Button className='w-full'>View Form</Button>
                    </Link>
                </CardFooter>
            </Card>
        ))}</div>)

}

export default FormsList;