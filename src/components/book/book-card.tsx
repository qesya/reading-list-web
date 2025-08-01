"use client";

import Link from "next/link";
import Image from "next/image";
import { type Book } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookToggle } from "@/components/book/book-toggle";
import { toggleRead } from "@/actions/book";
import { Pencil, Trash } from "lucide-react";

export function BookCard({
  book,
  onRequestDelete,
}: {
  book: Book;
  onRequestDelete: () => void;
}) {
  return (
    <div className="border rounded-xl shadow-sm px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center bg-white">
      {book.cover && (
        <div className="relative flex-shrink-0 w-24 h-32 mr-6 mb-4 sm:mb-0">
          <Image
            src={book.cover}
            alt={`Cover of ${book.title}`}
            fill
            sizes="96px"
            priority
            className="object-cover rounded-md"
          />
        </div>
      )}

      <div className="flex-grow min-w-0">
        <h2 className="text-xl font-semibold break-words">{book.title}</h2>
        <p className="text-sm text-muted-foreground break-words">
          by {book.author}
        </p>
        <Badge variant={book.read ? "default" : "outline"} className="mt-2">
          {book.read ? "Read" : "To Read"}
        </Badge>
      </div>

      <div className="flex flex-row w-full md:w-auto md:flex-col items-center md:items-end justify-between gap-2 sm:ml-auto mt-4 sm:mt-0">
        <form action={toggleRead}>
          <input type="hidden" name="id" value={book.id} />
          <BookToggle id={book.id} read={book.read} />
          <button
            type="submit"
            data-testid="submit-toggle"
            className="hidden"
          />
        </form>

        <div className="flex gap-2">
          <Link href={`/books/edit/${book.id}`}>
            <Button variant="outline" size="icon" aria-label="Edit Book">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="destructive"
            size="icon"
            onClick={onRequestDelete}
            aria-label="Delete Book"
            data-testid="delete-btn"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
