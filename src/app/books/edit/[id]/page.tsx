import { getBook } from "@/actions/book";
import { BookForm } from "@/components/book/book-form";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (isNaN(id)) {
    return (
      <div className="text-center p-8">
        <p>Invalid book ID.</p>
      </div>
    );
  }

  const book = await getBook(id);

  return (
    <main className="max-w-xl mx-auto p-6">
      <BookForm book={book} />
    </main>
  );
}
