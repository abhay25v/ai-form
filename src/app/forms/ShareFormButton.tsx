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
                <Button variant="outline" className="flex-1" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Form</DialogTitle>
                    <DialogDescription>
                        Make your form public and share it with others to collect responses.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="publish"
                            checked={isPublished}
                            onCheckedChange={handlePublishToggle}
                        />
                        <Label htmlFor="publish">
                            {isPublished ? "Form is published" : "Publish form"}
                        </Label>
                    </div>
                    
                    {isPublished && (
                        <div className="space-y-2">
                            <Label htmlFor="share-url">Share URL</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="share-url"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={copyToClipboard}
                                    className="shrink-0"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600">
                                Anyone with this link can view and submit responses to your form.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareFormButton;
