"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import { useOrders } from "./OrderContext";
import { Book, CartItem } from "@/types/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  addToCartAndShop: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  toggleCartItem: (book: Book) => void;
  isCartListed: (bookId: string) => boolean;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// export const CartProvider: React.FC<{ }> = ({
//   children,
// }) => {
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [isInitialized, setIsInitialized] = useState(false); // <- NOVO
//   const { addOrder } = useOrders();

//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) {
//       setItems(JSON.parse(savedCart));
//     }
//     setIsInitialized(true);
//   }, []);

//   useEffect(() => {
//     if (isInitialized) {
//       localStorage.setItem("cart", JSON.stringify(items));
//     }
//   }, [items, isInitialized]);

//   // const isCartListed = (bookId: string): boolean => {
//   //   return items.some((item) => item.book.id === bookId);
//   // };

//   // const addToCart = (book: Book) => {
//   //   setItems((prevItems) => {
//   //     const existingItem = prevItems.find((item) => item.book.id === book.id);

//   //     if (existingItem) {
//   //       // Se for ebook, não permitir adicionar novamente
//   //       if (book.format === "ebook") {
//   //         toast.error(
//   //           `${book.title} já foi adicionado ao carrinho. eBooks só podem ser adicionados uma vez.`
//   //         );
//   //         return prevItems;
//   //       }
//   //       // Se for livro físico, aumentar quantidade
//   //       toast.info(`Quantidade de ${book.title} aumentada no carrinho!`);
//   //       return prevItems.map((item) =>
//   //         item.book.id === book.id
//   //           ? { ...item, quantity: item.quantity + 1 }
//   //           : item
//   //       );
//   //     }

//   //     // Adicionar novo item
//   //     toast.info(`${book.title} adicionado ao carrinho!`);
//   //     return [...prevItems, { book, quantity: 1 }];
//   //   });
//   // };

//   // const addToCartAndShop = (book: Book) => {
//   //   setItems((prevItems) => {
//   //     const existingItem = prevItems.find((item) => item.book.id === book.id);
//   //     if (existingItem) {
//   //       return prevItems;
//   //     }

//   //     return [...prevItems, { book, quantity: 1 }];
//   //   });
//   // };
//   // const removeFromCart = (bookId: string) => {
//   //   setItems((prevItems) =>
//   //     prevItems.filter((item) => item.book.id !== bookId)
//   //   );
//   // };
//   // const toggleCartItem = (book: Book) => {
//   //   setItems((prevItems) => {
//   //     const existingItem = prevItems.find((item) => item.book.id === book.id);

//   //     if (existingItem) {
//   //       toast.warning(`${book.title} removido do carrinho.`);
//   //       return prevItems.filter((item) => item.book.id !== book.id);
//   //     } else {
//   //       toast.info(`${book.title} adicionado ao carrinho!`);
//   //       return [...prevItems, { book, quantity: 1 }];
//   //     }
//   //   });
//   // };

//   // const updateQuantity = (bookId: string, quantity: number) => {
//   //   if (quantity <= 0) {
//   //     removeFromCart(bookId);
//   //     return;
//   //   }

//   //   setItems((prevItems) =>
//   //     prevItems.map((item) => {
//   //       if (item.book.id === bookId) {
//   //         // Não permitir mudança de quantidade para ebooks
//   //         if (item.book.format === "ebook") {
//   //           toast.error("Não é possível alterar a quantidade de eBooks.");
//   //           return item;
//   //         }
//   //         return { ...item, quantity };
//   //       }
//   //       return item;
//   //     })
//   //   );
//   // };

//   // const clearCart = () => {
//   //   setItems([]);
//   // };

//   // const checkout = () => {
//   //   if (items.length === 0) {
//   //     toast.error("Seu carrinho está vazio!");
//   //     return;
//   //   }

//   //   // Criar pedido
//   //   const orderItems = items.map((item) => ({
//   //     book: item.book,
//   //     quantity: item.quantity,
//   //   }));

//   //   addOrder(orderItems, total);

//   //   // Limpar carrinho
//   //   clearCart();

//   //   toast.success("Pedido realizado com sucesso!");
//   // };

//   // const total = items.reduce(
//   //   (sum, item) => sum + item.book.price * item.quantity,
//   //   0
//   // );
//   // const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

//   // return (
//   //   <CartContext.Provider
//   //     value={{
//   //       items,
//   //       addToCart,
//   //       removeFromCart,
//   //       toggleCartItem,
//   //       isCartListed,
//   //       updateQuantity,
//   //       clearCart,
//   //       total,
//   //       totalItems,
//   //       checkout,
//   //       addToCartAndShop,
//   //     }}
//   //   >
//   //     {children}
//   //   </CartContext.Provider>
//   );
// };
