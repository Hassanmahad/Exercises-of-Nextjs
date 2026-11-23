
import { z } from "zod";

const dueDateSchema = z
  .string()
  .refine(
    (value) =>
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(Date.parse(value)) &&
      new Date(value).toISOString().slice(0, 10) === value,
    "Invalid date format. Use YYYY-MM-DD"
  )
  .nullable();

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .default(""),

  status: z
    .enum(["todo", "in-progress", "completed"])
    .optional()
    .default("todo"),

  priority: z
    .enum(["low", "medium", "high"])
    .optional()
    .default("medium"),

  dueDate: dueDateSchema
    .optional()
    .default(null),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required"
  );
