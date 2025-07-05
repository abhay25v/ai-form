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
import { Edit, Share2, Eye, BarChart3, Trash2 } from "lucide-react";
import ShareFormButton from "./ShareFormButton";
import DeleteFormButton from "./DeleteFormButton";

type Form = InferSelectModel<typeof forms>;

type Props = {
    forms: Form[];
}

const FormsList = (props: Props) => {
    return (
        <>
            {props.forms.map((form: Form) => (
                <Card key={form.id} className="w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="truncate">{form.name}</span>
                            <div className="flex items-center gap-2">
                                {form.published && (
                                    <div className="flex items-center gap-1 text-green-600 text-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Published
                                    </div>
                                )}
                                {!form.published && (
                                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        Draft
                                    </div>
                                )}
                            </div>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                            {form.description}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-2">
                        <div className="flex w-full gap-2">
                            <Link className="flex-1" href={`/forms/edit/${form.id}`}>
                                <Button variant="outline" className="w-full" size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                            <Link className="flex-1" href={`/forms/${form.id}`}>
                                <Button variant="outline" className="w-full" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </Button>
                            </Link>
                        </div>
                        <div className="flex w-full gap-2">
                            <ShareFormButton form={form} />
                            <Link className="flex-1" href={`/forms/results/${form.id}`}>
                                <Button variant="outline" className="w-full" size="sm">
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Results
                                </Button>
                            </Link>
                        </div>
                        <div className="flex w-full">
                            <DeleteFormButton formId={form.id} formName={form.name} />
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
}

export default FormsList;