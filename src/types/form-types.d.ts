import { InferSelectModel } from "drizzle-orm";
import { forms } from "../db/schema/forms";
import { questions } from "../db/schema/questions";
import { fieldOptions } from "../db/schema/fieldOptions";

export type FormSelectModel = InferSelectModel<typeof forms>;
export type QuestionSelectModel = InferSelectModel<typeof questions>;
export type FieldOptionSelectModel = InferSelectModel<typeof fieldOptions>;