import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookForm } from "../book-form";
import { useRouter } from "next/navigation";
import { addBook, updateBook } from "@/actions/book";
import { BookInput } from "@/lib/validation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image");

jest.mock("@/actions/book", () => ({
  addBook: jest.fn(),
  updateBook: jest.fn(),
}));

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => (values: BookInput) => ({
    values,
    errors: {},
  })),
}));

describe("BookForm", () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (addBook as jest.Mock).mockClear();
    (updateBook as jest.Mock).mockClear();
  });

  test('renders "Add a New Book" title when no book prop is provided', () => {
    render(<BookForm />);
    expect(screen.getByText("➕ Add a New Book")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Book" })
    ).toBeInTheDocument();
  });

  test('renders "Edit Book" title when a book prop is provided', () => {
    const mockBook = {
      id: 1,
      title: "Test Book",
      author: "Test Author",
      cover: "",
      read: false,
      createdAt: new Date(),
    };
    render(<BookForm book={mockBook} />);
    expect(screen.getByText("✍️ Edit Book")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Changes" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Test Book");
    expect(screen.getByLabelText("Author")).toHaveValue("Test Author");
  });

  test("submits form to add a new book", async () => {
    render(<BookForm />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "New Book Title" },
    });
    fireEvent.change(screen.getByLabelText("Author"), {
      target: { value: "New Book Author" },
    });
    fireEvent.change(screen.getByLabelText("Cover URL (Optional)"), {
      target: { value: "http://example.com/new.jpg" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Book" }));

    await waitFor(() => {
      expect(addBook).toHaveBeenCalledTimes(1);
      expect(addBook).toHaveBeenCalledWith({
        title: "New Book Title",
        author: "New Book Author",
        cover: "http://example.com/new.jpg",
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  test("submits form to update an existing book", async () => {
    const mockBook = {
      id: 1,
      title: "Old Title",
      author: "Old Author",
      cover: "http://example.com/old.jpg",
      read: false,
      createdAt: new Date(),
    };
    render(<BookForm book={mockBook} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated Title" },
    });
    fireEvent.change(screen.getByLabelText("Author"), {
      target: { value: "Updated Author" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect(updateBook).toHaveBeenCalledTimes(1);
      expect(updateBook).toHaveBeenCalledWith(1, {
        title: "Updated Title",
        author: "Updated Author",
        cover: "http://example.com/old.jpg",
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  test("navigates to /books when Cancel button is clicked", () => {
    render(<BookForm />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
