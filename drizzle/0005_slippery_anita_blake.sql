CREATE TABLE "form_submission" (
	"id" serial PRIMARY KEY NOT NULL,
	"formId" integer,
	"userId" text,
	"submittedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answers" RENAME TO "answer";--> statement-breakpoint
ALTER TABLE "field_options" RENAME TO "authenticator";--> statement-breakpoint
ALTER TABLE "form_submissions" RENAME TO "field_option";--> statement-breakpoint
ALTER TABLE "authenticator" RENAME COLUMN "id" TO "credentialID";--> statement-breakpoint
ALTER TABLE "authenticator" RENAME COLUMN "text" TO "userId";--> statement-breakpoint
ALTER TABLE "authenticator" RENAME COLUMN "value" TO "providerAccountId";--> statement-breakpoint
ALTER TABLE "authenticator" RENAME COLUMN "questionId" TO "credentialPublicKey";--> statement-breakpoint
ALTER TABLE "field_option" RENAME COLUMN "formId" TO "text";--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_provider_providerAccountId_pk";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP CONSTRAINT "verificationToken_identifier_token_pk";--> statement-breakpoint
ALTER TABLE "form" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "counter" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "credentialDeviceType" text NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "credentialBackedUp" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "transports" text;--> statement-breakpoint
ALTER TABLE "field_option" ADD COLUMN "questionId" integer;--> statement-breakpoint
ALTER TABLE "field_option" ADD COLUMN "value" text;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "stripe_customer_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "subscribed";--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");