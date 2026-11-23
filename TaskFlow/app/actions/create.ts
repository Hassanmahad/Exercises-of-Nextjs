
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createTodo } from "../lib/todo";

export type FormState = {
  error: string | null;
};

export async function createTodoAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = formData.get("title") as string;

  if (!title || title.trim().length === 0) {
    return { error: "Title is required" };
  }

  if (title.length > 200) {
    return { error: "Title must be less than 200 characters" };
  }

  const todoId = await createTodo({ title: title.trim() });

  if (!todoId) {
    return { error: "Failed to create todo" };
  }

  revalidatePath("/");
  redirect("/");
}
