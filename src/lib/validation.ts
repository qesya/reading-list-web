import { z } from "zod"
import { isValidImagePath } from "./utils";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  cover: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val || val === "" || isValidImagePath(val),
      { message: "Please enter a valid image URL or path." }
    ),
});

export type BookInput = z.infer<typeof bookSchema>
