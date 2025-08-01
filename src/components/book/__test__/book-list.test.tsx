import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookList } from "../book-list";
import { deleteBook } from "@/actions/book";
import { Book } from "@/generated/prisma";

jest.mock("@/actions/book", () => ({
  deleteBook: jest.fn(),
}));

jest.mock("../book-card", () => ({
  BookCard: ({
    book,
    onRequestDelete,
  }: {
    book: Book;
    onRequestDelete: (book: Book) => void;
  }) => (
    <div>
      <h2>{book.title}</h2>
      <button onClick={() => onRequestDelete(book)}>Delete</button>
    </div>
  ),
}));

describe("BookList", () => {
  const mockBooks = [
    {
      id: 1,
      title: "Book One",
      author: "Author One",
      read: false,
      cover: null,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Book Two",
      author: "Author Two",
      read: true,
      cover: null,
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all books", () => {
    render(<BookList books={mockBooks} />);

    expect(screen.getByText("Book One")).toBeInTheDocument();
    expect(screen.getByText("Book Two")).toBeInTheDocument();
  });

  test("shows delete confirmation dialog when Delete button is clicked", async () => {
    render(<BookList books={mockBooks} />);
    fireEvent.click(screen.getAllByText("Delete")[0]);

    expect(
      await screen.findByText("Are you absolutely sure?")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "This action cannot be undone. This will permanently delete your book and remove its data from our servers."
      )
    ).toBeInTheDocument();
  });

  test("calls deleteBook with correct formData and closes dialog", async () => {
    const deleteBookMock = deleteBook as jest.Mock;

    render(<BookList books={mockBooks} />);
    fireEvent.click(screen.getAllByText("Delete")[0]);

    const confirmButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteBookMock).toHaveBeenCalledTimes(1);
      const formArg = deleteBookMock.mock.calls[0][0];
      expect(formArg.get("id")).toBe("1");
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Are you absolutely sure?")
      ).not.toBeInTheDocument();
    });
  });

  test("closes dialog on cancel", async () => {
    render(<BookList books={mockBooks} />);
    fireEvent.click(screen.getAllByText("Delete")[0]);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Are you absolutely sure?")
      ).not.toBeInTheDocument();
    });
  });
});
