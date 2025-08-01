import Link from "next/link";
import { getBook } from "@/actions/book";
import { BookForm } from "@/components/book/book-form";
import { Button } from "@/components/ui/button";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (isNaN(id)) {
    return (
      <div className="text-center p-8 space-y-4">
        <p>Invalid book ID.</p>
        <Link href="/books">
          <Button variant="outline">← Back to list</Button>
        </Link>
      </div>
    );
  }

  const book = await getBook(id);

  if (!book) {
    return (
      <div className="flex flex-col h-screen justify-center items-center text-center p-8 space-y-4">
        <h1 className="text-2xl">Book not found.</h1>
        <Link href="/">
          <Button variant="outline">Back to list</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <BookForm book={book} />
    </main>
  );
}
