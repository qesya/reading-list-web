"use client";

import { useState, useTransition } from "react";
import { Book } from "@/generated/prisma";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteBook } from "@/actions/book";
import { BookCard } from "./book-card";

export function BookList({ books }: { books: Book[] }) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!selectedBook) return;

    const formData = new FormData();
    formData.append("id", String(selectedBook.id));

    startTransition(async () => {
      setSelectedBook(null);
      await deleteBook(formData);
    });
  };
  return (
    <>
      <div className="grid gap-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onRequestDelete={() => setSelectedBook(book)}
          />
        ))}
      </div>

      <AlertDialog
        open={!!selectedBook}
        onOpenChange={() => setSelectedBook(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              book and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedBook(null)}>
              Cancel
            </AlertDialogCancel>
            <Button onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
