"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { forms } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toggleFormPublish } from "../actions/toggleFormPublish";
import { Switch } from "@/components/ui/switch";

type Form = InferSelectModel<typeof forms>;

type Props = {
    form: Form;
}

const ShareFormButton = ({ form }: Props) => {
    const [copied, setCopied] = useState(false);
    const [isPublished, setIsPublished] = useState(form.published ?? false);
    const [isOpen, setIsOpen] = useState(false);

    const shareUrl = `${window.location.origin}/forms/${form.id}`;
    
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handlePublishToggle = async () => {
        try {
            const result = await toggleFormPublish(form.id, !isPublished);
            if (result.success) {
                setIsPublished(!isPublished);
            }
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 group/btn hover:bg-slate-50 hover:border-slate-200 transition-colors" size="sm">
                    <Share2 className="h-4 w-4 mr-2 group-hover/btn:text-slate-600" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-0 shadow-2xl">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-xl font-bold text-gray-900">Share Your Form</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Make your form public and share it with others to collect responses.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="space-y-1">
                            <Label htmlFor="publish" className="text-sm font-medium text-gray-900">
                                {isPublished ? "Form is Live 🟢" : "Publish Form"}
                            </Label>
                            <p className="text-xs text-gray-500">
                                {isPublished ? "Your form is accepting responses" : "Make your form accessible to everyone"}
                            </p>
                        </div>
                        <Switch
                            id="publish"
                            checked={isPublished}
                            onCheckedChange={handlePublishToggle}
                            className="data-[state=checked]:bg-emerald-500"
                        />
                    </div>
                    
                    {isPublished && (
                        <div className="space-y-4 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-100">
                            <Label htmlFor="share-url" className="text-sm font-medium text-gray-900">Share URL</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="share-url"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 bg-white border-emerald-200 focus:border-emerald-400"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={copyToClipboard}
                                    className={`shrink-0 transition-all duration-200 ${copied ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'hover:bg-emerald-100 hover:border-emerald-300'}`}
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-100 p-3 rounded-lg">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                Anyone with this link can view and submit responses to your form.
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareFormButton;
