"use server";
import { Book } from "@/types/types";
import axios from "axios";
import { routes } from "@/config/routes";
import { getErrorMessage } from "../utils";

export default async function getAllBooks() {
  try {
    const response = await fetch(routes.books, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return {
        success: false,
        error: "Erro ao carregar os livros",
        status: response.status,
      };
    }

    const data: Book[] = await response.json();

    return { success: true, books: data, status: response.status };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
export async function loadBooks(): Promise<Book[]> {
  const result = await getAllBooks();
  if (!result.success) {
    throw new Error(result.error || "Erro desconhecido");
  }
  return result.books!;
}

export async function getBookById(id: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const { books: data } = await getAllBooks();

    const book = data?.find((book) => book.id === id);

    return { success: true, book: book };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPopularBooks() {
  const currentBooks = await loadBooks();
  return [...currentBooks].sort((a, b) => b.rating - a.rating).slice(0, 6);
}
export async function getNewestBooks() {
  const currentBooks = await loadBooks();
  return [...currentBooks]
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    )
    .slice(0, 6);
}

export async function getRelatedBooks(bookId: string) {
  const currentBooks = await loadBooks();
  const currentBook = currentBooks.find((book) => book.id === bookId);
  if (!currentBook) return [];

  const currentCategoryIds = currentBook.categories.map((cat) => cat.id);

  return currentBooks.filter(
    (book) =>
      book.id !== bookId &&
      book.categories.some((category) =>
        currentCategoryIds.includes(category.id)
      )
  );
}

export async function getBooksByAuthor(
  authorList: string[] = [],
  excludeBookId?: string
) {
  const currentBooks = await loadBooks();

  const normalizedAuthorList = authorList
    .filter((a) => typeof a === "string")
    .map((a) => a.trim().toLowerCase());

  return currentBooks.filter((book) => {
    const authors = Array.isArray(book.author)
      ? book.author
      : typeof book.author === "string"
      ? [book.author]
      : [];

    const normalizedBookAuthors = authors
      .filter((a) => typeof a === "string")
      .map((a) => a.trim().toLowerCase());

    const hasCommonAuthor = normalizedBookAuthors.some((a) =>
      normalizedAuthorList.includes(a)
    );

    return hasCommonAuthor && (!excludeBookId || book.id !== excludeBookId);
  });
}
export async function getBooksByGenre(genre: string) {
  const currentBooks = await loadBooks();

  return currentBooks.filter((book) =>
    book.categories?.some((cat) =>
      cat.name.toLowerCase().includes(genre.toLowerCase())
    )
  );
}
export async function getAllGenres(): Promise<string[]> {
  const currentBooks = await loadBooks();
  const genresSet = new Set<string>();
  currentBooks.forEach((book) => {
    book.categories.forEach((category) => {
      genresSet.add(category.name);
    });
  });
  return Array.from(genresSet).sort();
}
