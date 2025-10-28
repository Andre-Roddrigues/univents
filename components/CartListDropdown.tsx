// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Heart, ShoppingCart, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// // Hooks para sincronizar cartList do servidor com cliente
// const useCartList = () => {
//   const [cartList, setcartList] = useState<CartListBook[]>([]);

//   useEffect(() => {
//     const fetchCartList = async () => {
//       try {
//         const response = await fetch("/api/cartList");
//         const data = await response.json();
//         setcartList(data);
//       } catch (error) {
//         console.error("Erro ao buscar cartList", error);
//       }
//     };

//     fetchCartList();
//   }, []);

//   const removeFromcartList = async (bookId: string) => {
//     try {
//       await toggleCartList({ id: bookId } as CartListBook);
//       setcartList(cartList.filter((book) => book.id !== bookId));
//     } catch (error) {
//       console.error("Erro ao remover da cartList", error);
//     }
//   };

//   return { cartList, removeFromcartList };
// };

// export function CartListDropdown() {
//   const { cartList, removeFromcartList } = useCartList();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className="relative">
//           <ShoppingCart className="h-5 w-5" />
//           {cartList.length > 0 && (
//             <span
//               className="absolute -top-2 -right-2 bg-primary text-white
//               rounded-full h-4 w-4 flex items-center justify-center text-xs"
//             >
//               {cartList.length}
//             </span>
//           )}
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent className="w-96 p-4" align="end">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Carrinho de compras</h3>
//           <span className="text-sm text-gray-500">
//             {cartList.length} item(s)
//           </span>
//         </div>

//         {cartList.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <Heart className="mx-auto h-12 w-12 mb-4 text-gray-300" />
//             <p>Seu carrinho está vazio</p>
//             <p className="text-sm">Adicione seus livros favoritos!</p>
//           </div>
//         ) : (
//           <div className="space-y-4 max-h-96 overflow-y-auto">
//             {cartList.map((book: any) => (
//               <div
//                 key={book.id}
//                 className="flex items-center justify-between border-b pb-2"
//               >
//                 <div className="flex items-center space-x-4">
//                   <Image
//                     src={book.coverImage!}
//                     alt={book.title!}
//                     width={50}
//                     height={75}
//                     className="object-cover"
//                   />
//                   <div>
//                     <h4 className="font-medium line-clamp-1">{book.title}</h4>
//                     <p className="text-sm text-gray-500 line-clamp-1">
//                       {book.authors}
//                     </p>
//                     <p className="font-semibold text-green-600">
//                       MT {book.price?.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => removeFromcartList(book?.id)}
//                   >
//                     <Trash2 className="h-4 w-4 text-red-500" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {cartList.length > 0 && (
//           <div className="mt-4">
//             <Link href="/cartList" passHref>
//               <Button className="w-full">Ver Carrinho Completo</Button>
//             </Link>
//           </div>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
