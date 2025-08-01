import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookList } from "@/components/book/book-list";
import { getBooks } from "@/actions/book";
import { Suspense } from "react";
import { PlusIcon } from "lucide-react";
import { SearchForm } from "@/components/search-form";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const search =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : "";

  const books = await getBooks(search);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          📚 Reading List
        </h1>
        <Link href="/books/add">
          <Button>
            <PlusIcon /> Add Book
          </Button>
        </Link>
      </div>

      <Suspense>
        <SearchForm />
      </Suspense>

      {books.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No books yet. Add your first one!
        </p>
      ) : (
        <BookList books={books} />
      )}
    </main>
  );
}
