"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/CartContext";
import { Book, CartItem } from "@/types/types";
import { useRouter } from "next/navigation";

interface CartListButtonProps {
  book: Book;
  label?: string;
}

export function BuyButton({ book, label = "Comprar" }: CartListButtonProps) {
  const { addToCartAndShop } = useCart();

  const router = useRouter();

  const handleBuyBook = () => {
    try {
      addToCartAndShop(book);
      router.push("/cart");
    } catch (error) {
      console.error("Erro ao atualizar cartList", error);
    }
  };

  return (
    <Button onClick={handleBuyBook} className=" w-full">
      {label}
    </Button>
  );
}
