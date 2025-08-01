import { render, screen } from "@testing-library/react";
import HomePage from "../page";
import { getBooks } from "@/actions/book";

jest.mock("@/actions/book", () => ({
  getBooks: jest.fn(),
}));

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = "Link";
  return MockLink;
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "/",
}));

describe("Books HomePage", () => {
  beforeEach(() => {
    (getBooks as jest.Mock).mockClear();
  });

  test('renders "No books yet" message when no books are found', async () => {
    (getBooks as jest.Mock).mockResolvedValue([]);

    render(await HomePage({ searchParams: Promise.resolve({ search: "" }) }));

    expect(screen.getByText("📚 Reading List")).toBeInTheDocument();
    expect(
      screen.getByText("No books yet. Add your first one!")
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test("renders a list of books when books are found", async () => {
    const mockBooks = [
      {
        id: 1,
        title: "Book 1",
        author: "Author 1",
        read: false,
        cover: null,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Book 2",
        author: "Author 2",
        read: true,
        cover: "cover2.jpg",
        createdAt: new Date(),
      },
    ];

    (getBooks as jest.Mock).mockResolvedValue(mockBooks);

    render(await HomePage({ searchParams: Promise.resolve({ search: "" }) }));

    expect(screen.getByText("📚 Reading List")).toBeInTheDocument();
    expect(screen.getByText("Add Book")).toBeInTheDocument();

    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText("by Author 1")).toBeInTheDocument();
    expect(screen.getByText("Book 2")).toBeInTheDocument();
    expect(screen.getByText("by Author 2")).toBeInTheDocument();

    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText("Book 2")).toBeInTheDocument();
  });

  test("calls getBooks with correct orderBy", async () => {
    (getBooks as jest.Mock).mockResolvedValue([]);

    render(await HomePage({ searchParams: Promise.resolve({ search: "" }) }));

    expect(getBooks).toHaveBeenCalledTimes(1);
    expect(getBooks).toHaveBeenCalledWith("");
  });
});
