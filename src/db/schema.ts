import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    serial,
    pgEnum,
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "next-auth/adapters"
import { desc } from "drizzle-orm"
import { relations } from "drizzle-orm"

export const formElements = pgEnum("field_type", [
    "RadioGroup",
    "Select",
    "Input",
    "Textarea",
    "Switch",
])

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/drizzle"
const pool = postgres(connectionString, { max: 1 })

export const db = drizzle(pool)

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    password: text("password"),
})






export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [verificationToken.identifier, verificationToken.token],
            }),
        },
    ]
)

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID],
            }),
        },
    ]
);


export const forms = pgTable("form", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    userId: text("userId"), // changed from "user_Id" to "userId"
    published: boolean("published"),
});

export const formsRelations = relations(forms, ({ many, one }) => ({


    questions: many(questions),
    user: one(users, {
        fields: [forms.userId],
        references: [users.id],
    }),
    submissions: many(formSubmissions),
}));


export const questions = pgTable("question", {
    id: serial("id").primaryKey(),
    text: text("text"),
    fieldType: formElements("field_type"),
    formId: integer("formId"), // changed from "form_id" to "formId"
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
    form: one(forms, {



        fields: [questions.formId],
        references: [forms.id],
    }),
    fieldOptions: many(fieldOptions),
    answers: many(answers),
}));

export const fieldOptions = pgTable("field_option", {



    id: serial("id").primaryKey(),
    text: text("text"),
    questionId: integer("questionId"), // changed from "question_id" to "questionId"
    value: text("value"),
});



export const fieldOptionsRelations = relations(fieldOptions, ({ one }) => ({
    question: one(questions, {
        fields: [fieldOptions.questionId],





        references: [questions.id],
    }),
}));


export const answers = pgTable("answer", {


    id: serial("id").primaryKey(),
    value: text("value"),
    questionId: integer("questionId"), // changed from "question_id" to "questionId"
    formSubmissionId: integer("formSubmissionId"), // changed from "form_submission_id" to "formSubmissionId"
    fieldOptionsId: integer("fieldOptionsId"), // changed from "field_options_id" to "fieldOptionsId"
});






export const answersRelations = relations(answers, ({ one }) => ({


    question: one(questions, {
        fields: [answers.questionId],
        references: [questions.id],
    }),
    formSubmission: one(formSubmissions, {
        fields: [answers.formSubmissionId],
        references: [formSubmissions.id],
    }),
    fieldOptions: one(fieldOptions, {
        fields: [answers.fieldOptionsId],
        references: [fieldOptions.id],











    }),
}));


export const formSubmissions = pgTable("form_submission", {


    id: serial("id").primaryKey(),
    formId: integer("formId"), // changed from "form_id" to "formId"
    userId: text("userId"), // changed from "user_Id" to "userId"
    submittedAt: timestamp("submittedAt", { mode: "date" }).notNull().defaultNow(),
});

export const formSubmissionsRelations = relations(formSubmissions, ({ one, many }) => ({
    form: one(forms, {
        fields: [formSubmissions.formId],





        references: [forms.id],
    }),
    user: one(users, {
        fields: [formSubmissions.userId],
        references: [users.id],
    }),
    answers: many(answers),
}));