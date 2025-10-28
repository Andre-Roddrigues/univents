"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/CartContext";
import { Book, CartItem } from "@/types/types";

interface CartListButtonProps {
  book: Book;
  isCartIcon?: boolean;
}

export function AddToCartButton({
  book,
  isCartIcon = true,
}: CartListButtonProps) {
  const { isCartListed, toggleCartItem } = useCart();
  const iscartListed = isCartListed(book.id);
  const isEbook = book.format?.toLowerCase() !== "livro";

  const handletoggleCartList = () => {
    try {
      toggleCartItem(book);
    } catch (error) {
      console.error("Erro ao atualizar cartList", error);
    }
  };

  if (isCartIcon) {
    return (
      <Button
        onClick={handletoggleCartList}
        variant={"outline"}
        className="hover:text-none "
      >
        <ShoppingCart
          className={`w-8 h-8 ${
            iscartListed ? "fill-primary dark:text-primary " : "fill-white"
          }`}
        />
      </Button>
    );
  }

  return (
    <Button
      onClick={handletoggleCartList}
      className={`border border-border p-2 transition-all w-full `}
      aria-label={
        iscartListed ? "Remover do carrinho" : "Adicionar ao carrinho"
      }
      variant={iscartListed ? "destructive" : "outline"}
    >
      <ShoppingCart
        className={`
            w-6 h-6
            ${iscartListed ? "fill-white " : " hover:te"}
          `}
      />
      {iscartListed ? "Remover do carrinho" : "Adicionar ao carrinho"}
    </Button>
  );
}
