export type FieldOption = {
  id: number;
  text: string | null;
  questionId: number | null;
  value: string | null;
};

export type Question = {
  id: number;
  text: string | null;
  fieldType: string | null;
  formId: number | null;
  fieldOptions: FieldOption[];
};

export type Answer = {
  id: number;
  value: string | null;
  questionId: number;
  formSubmissionId: number;
  fieldOptionsId: number | null;
  fieldOptions?: FieldOption | null;
  question?: Question | null;
};

export type Submission = {
  id: number;
  formId: number | null;
  userId: string | null;
  submittedAt: Date; // <-- change from string to Date
  answers: Answer[];
};

export type Form = {
  id: number;
  name: string;
  userId: string | null;
  description: string | null;
  published: boolean | null;
  questions: Question[];
  submissions: Submission[];
};