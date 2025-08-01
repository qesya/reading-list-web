"use server";

import { prisma } from "@/lib/prisma";
import { BookInput, bookSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function getBooks(search?: string) {
  const books = await prisma.book.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, lte: "insensitive" } },
                { author: { contains: search, lte: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });
  return books;
}

export async function getBook(id: number) {
  const book = await prisma.book.findUnique({ where: { id } });
  return book;
}

export async function addBook(data: BookInput) {
  const parsed = bookSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid input: " + JSON.stringify(parsed.error.flatten()));
  }

  const { title, author, cover } = parsed.data;

  await prisma.book.create({
    data: {
      title,
      author,
      cover,
      read: false,
    },
  });

  revalidatePath("/");
}
export async function toggleRead(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) throw new Error("Invalid ID");

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) throw new Error("Book not found");

  await prisma.book.update({
    where: { id },
    data: { read: !book.read },
  });

  revalidatePath("/");
}

export async function deleteBook(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) throw new Error("Invalid ID");

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) throw new Error("Book not found");

  await prisma.book.delete({ where: { id } });

  revalidatePath("/");
}

export async function updateBook(id: number, data: BookInput) {
  const parsed = bookSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid input: " + JSON.stringify(parsed.error.flatten()));
  }

  const { title, author, cover } = parsed.data;

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) throw new Error("Book not found");

  await prisma.book.update({
    where: { id },
    data: {
      title,
      author,
      cover,
    },
  });

  revalidatePath("/");
}
