import React from "react";
import { forms } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, Eye, BarChart3 } from "lucide-react";
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
                <Card key={form.id} className="w-full relative group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <DeleteFormButton formId={form.id} formName={form.name} />
                        </div>
                        <CardTitle className="pr-12 space-y-3">
                            <div className="break-words text-gray-900 font-semibold text-lg leading-tight">{form.name}</div>
                            <div className="flex items-center gap-2">
                                {form.published ? (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        Published
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        Draft
                                    </div>
                                )}
                            </div>
                        </CardTitle>
                        <CardDescription className="break-words pr-8 text-gray-600 leading-relaxed">
                            {form.description}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-3 pt-4 bg-gray-50/50">
                        <div className="flex w-full gap-2">
                            <Link className="flex-1" href={`/forms/edit/${form.id}`}>
                                <Button variant="outline" className="w-full group/btn hover:bg-emerald-50 hover:border-emerald-200 transition-colors" size="sm">
                                    <Edit className="h-4 w-4 mr-2 group-hover/btn:text-emerald-600" />
                                    Edit
                                </Button>
                            </Link>
                            <Link className="flex-1" href={`/forms/${form.id}`}>
                                <Button variant="outline" className="w-full group/btn hover:bg-teal-50 hover:border-teal-200 transition-colors" size="sm">
                                    <Eye className="h-4 w-4 mr-2 group-hover/btn:text-teal-600" />
                                    View
                                </Button>
                            </Link>
                        </div>
                        <div className="flex w-full gap-2">
                            <ShareFormButton form={form} />
                            <Link className="flex-1" href={`/forms/results/${form.id}`}>
                                <Button variant="outline" className="w-full group/btn hover:bg-orange-50 hover:border-orange-200 transition-colors" size="sm">
                                    <BarChart3 className="h-4 w-4 mr-2 group-hover/btn:text-orange-600" />
                                    Results
                                </Button>
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
}

export default FormsList;