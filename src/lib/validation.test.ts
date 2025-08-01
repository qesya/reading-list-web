import { bookSchema } from "@/lib/validation";

describe("bookSchema", () => {
  it("should validate a book with a title and author", () => {
    const book = { title: "Test Title", author: "Test Author" };
    const result = bookSchema.safeParse(book);
    expect(result.success).toBe(true);
  });

  it("should reject a book with an empty title", () => {
    const book = { title: "", author: "Test Author" };
    const result = bookSchema.safeParse(book);
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.title).toEqual([
      "Title is required",
    ]);
  });

  it("should reject a book with an empty author", () => {
    const book = { title: "Test Title", author: "", cover: "" };
    const result = bookSchema.safeParse(book);
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.author).toEqual([
      "Author is required",
    ]);
  });

  it("should validate a book with a title, author, and optional cover", () => {
    const book = {
      title: "Test Title",
      author: "Test Author",
      cover: "http://example.com/cover.jpg",
    };
    const result = bookSchema.safeParse(book);
    expect(result.success).toBe(true);
  });
});
