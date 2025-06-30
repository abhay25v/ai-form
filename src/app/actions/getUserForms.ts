"use server"
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { forms } from "@/db/schema";
import { auth } from "@/auth";

export async function getUserForms() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const userForms = await db.query.forms.findMany({
    where: eq(forms.userId, session.user.id),
  });

  return userForms;
    
}