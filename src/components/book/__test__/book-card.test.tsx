import { render, screen, fireEvent } from "@testing-library/react";
import { BookCard } from "../book-card";
import { Book } from "@/generated/prisma";
import "@testing-library/jest-dom";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ src, alt, style }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} style={style} />
  ),
}));

jest.mock("@/actions/book", () => ({
  toggleRead: jest.fn(),
  deleteBook: jest.fn(),
}));

const mockBook: Book = {
  id: 1,
  title: "Test Book",
  author: "Test Author",
  read: false,
  cover: "https://example.com/cover.jpg",
  createdAt: new Date(),
};

describe("BookCard", () => {
  const mockOnRequestDelete = jest.fn();

  it("renders book title, author, and cover", () => {
    render(<BookCard book={mockBook} onRequestDelete={mockOnRequestDelete} />);
    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("by Test Author")).toBeInTheDocument();
    expect(screen.getByAltText("Cover of Test Book")).toBeInTheDocument();
  });

  it("shows badge as 'To Read' when unread", () => {
    render(<BookCard book={mockBook} onRequestDelete={mockOnRequestDelete} />);
    expect(screen.getByText("To Read")).toBeInTheDocument();
  });

  it("shows badge as 'Read' when read is true", () => {
    render(
      <BookCard
        book={{ ...mockBook, read: true }}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    expect(screen.getByText("Read")).toBeInTheDocument();
  });

  it("renders edit button with correct link", () => {
    render(<BookCard book={mockBook} onRequestDelete={mockOnRequestDelete} />);
    const editLink = screen.getByRole("link");
    expect(editLink).toHaveAttribute("href", "/books/edit/1");
  });

  it("calls onRequestDelete when delete button is clicked", () => {
    render(<BookCard book={mockBook} onRequestDelete={mockOnRequestDelete} />);
    const deleteButton = screen.getByTestId("delete-btn");
    fireEvent.click(deleteButton);
    expect(mockOnRequestDelete).toHaveBeenCalled();
  });

  it("renders hidden submit button for toggleRead", () => {
    render(<BookCard book={mockBook} onRequestDelete={mockOnRequestDelete} />);
    const submitButton = screen.getByTestId("submit-toggle");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });
});
