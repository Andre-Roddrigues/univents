"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CarouselControlsProps {
  carouselId: string;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({ carouselId }) => {
  const scroll = (direction: "left" | "right") => {
    // Encontra o carousel específico pelo ID
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const scrollAmount = carousel.clientWidth * 0.8;

    if (direction === "left") {
      carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => scroll("left")}
        className="rounded-full"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => scroll("right")}
        className="rounded-full"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CarouselControls;
