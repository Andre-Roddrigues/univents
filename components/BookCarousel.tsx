import React from "react";
import BookCard from "./BookCard";
import { Book } from "@/types/types";
import CarouselControls from "./CarouselControls";

interface BookCarouselProps {
  title: string;
  books: Book[];
}

const BookCarousel: React.FC<BookCarouselProps> = ({ title, books }) => {
  if (books.length === 0) {
    return null;
  }

  const carouselId = `carousel-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="my-8 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-primary font-bold ">{title}</h2>
        <CarouselControls carouselId={carouselId} />
      </div>
      <div
        id={carouselId}
        className="carousel flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 snap-x scroll-smooth"
      >
        {books?.map((book) => (
          <div
            key={Math.random() * Math.random()}
            className="flex-none w-[280px] snap-start"
          >
            <BookCard key={book.id} book={book} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCarousel;
