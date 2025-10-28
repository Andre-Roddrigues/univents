import React from "react";

import BookCard from "./BookCard";
import { Book } from "@/types/types";

interface BookGridProps {
  books: Book[];
  columns?: number;
}

const BookGrid: React.FC<BookGridProps> = ({ books, columns = 4 }) => {
  const gridClasses =
    {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 xs:grid-cols-2 md:grid-cols-3",
      4: "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    }[columns] || "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  if (books.length === 0) {
    return (
      <div
        key={Math.random()}
        className="flex justify-center items-center py-12"
      >
        <p className="text-muted-foreground">Nenhum livro encontrado</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClasses} gap-4`}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;
