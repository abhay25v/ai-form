ALTER TABLE "answers" RENAME COLUMN "question_id" TO "questionId";--> statement-breakpoint
ALTER TABLE "answers" RENAME COLUMN "form_submission_id" TO "formSubmissionId";--> statement-breakpoint
ALTER TABLE "answers" RENAME COLUMN "field_options_id" TO "fieldOptionsId";--> statement-breakpoint
ALTER TABLE "field_options" RENAME COLUMN "question_id" TO "questionId";--> statement-breakpoint
ALTER TABLE "form_submissions" RENAME COLUMN "form_id" TO "formId";--> statement-breakpoint
ALTER TABLE "question" RENAME COLUMN "form_id" TO "formId";