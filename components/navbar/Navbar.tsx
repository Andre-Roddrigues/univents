"use client";

import React, { useEffect, useState } from "react";
import { navLinks } from "./Navlinks";
import NavItem from "./NavbarItem";
import Logo from "./Logo";
import MenuButton from "./MenuButton";
import AuthButtons from "./AuthButtons";
import LogoutButton from "./LogoutButton";
import { UserCircle, ShoppingCart } from "lucide-react";
import CartModal from "./CartModal";
import { listCarts } from "@/lib/actions/cart-actions";
import { getSession } from "@/lib/actions/getSession";

interface CartItem {
  id: string;
  ticketId: string;
  quantity: number;
  price: number;
  totalProductDiscount: number | null;
}

interface Cart {
  id: string;
  discount: number | null;
  totalPriceAftertDiscount: number | null;
  totalPrice: number;
  userId: string;
  status: 'pending' | 'paid' | 'canceled';
  cartItems: CartItem[];
}

function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isLogged, setIsLogged] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ================================
  // 1️⃣ CARREGAR SESSÃO
  // ================================
  useEffect(() => {
    async function loadSession() {
      const res = await getSession();
      setIsLogged(!!res.token);
    }
    loadSession();
  }, []);

  // ================================
  // 2️⃣ CONTAGEM APENAS DE CARRINHOS PENDING
  // ================================
  useEffect(() => {
    async function updateCartCount() {
      try {
        const result = await listCarts();
        console.log("Resultado da API:", result); // DEBUG

        if (result.success && Array.isArray(result.carts)) {
          // Filtra apenas carrinhos com status 'pending'
          const pendingCarts = result.carts.filter((cart: Cart) => cart.status === 'pending');
          console.log("Carrinhos pending:", pendingCarts); // DEBUG

          // Soma apenas os itens dos carrinhos pending
          const totalItems = pendingCarts.reduce((total, cart) => {
            const cartTotal = cart.cartItems.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
            console.log(`Carrinho ${cart.id} (${cart.status}): ${cartTotal} itens`); // DEBUG
            return total + cartTotal;
          }, 0);

          console.log("Total de itens em carrinhos pending:", totalItems); // DEBUG
          setCartItemsCount(totalItems);
        } else {
          console.log("Nenhum carrinho encontrado ou erro na resposta");
          setCartItemsCount(0);
        }
      } catch (err) {
        console.error("Erro ao carregar carrinhos:", err);
        setCartItemsCount(0);
      }
    }

    updateCartCount();

    // Evento global para atualizar quando o carrinho muda
    const handleCartUpdate = () => {
      console.log("Evento cartUpdated disparado"); // DEBUG
      updateCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    // Polling a cada 10 segundos
    const interval = setInterval(updateCartCount, 10000);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  // Atualizar quando modal do carrinho fecha
  useEffect(() => {
    if (!isCartOpen) {
      console.log("Modal fechado, atualizando contagem..."); // DEBUG
      setTimeout(() => {
        window.dispatchEvent(new Event("cartUpdated"));
      }, 1000);
    }
  }, [isCartOpen]);

  return (
    <>
      <header className="sticky font-playfair top-0 z-50 border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto md:px-4 lg:px-0 w-full">
          <div className="flex h-16 items-center justify-between w-full px-2 md:px-4">
            <Logo />

            {/* LINKS DESKTOP */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link, index) => (
                <NavItem key={index} href={link.href} label={link.label} />
              ))}
            </nav>

            {/* AÇÕES DESKTOP */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                title="Meu Carrinho"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
                {/* REMOVIDO: Mostrar zero para debug - agora só mostra badge quando tem itens */}
              </button>

              {isLogged ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <UserCircle className="w-7 h-7" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-card shadow-lg rounded-lg border z-50">
                      <a
                        href="/perfil"
                        className="block px-4 py-2 hover:bg-muted transition-colors"
                      >
                        Meu Perfil
                      </a>
                      <a
                        href="/meus-bilhetes"
                        className="block px-4 py-2 hover:bg-muted transition-colors"
                      >
                        Meus Bilhetes
                      </a>
                      <div className="border-t border-border">
                        <LogoutButton/>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <AuthButtons />
              )}
            </div>

            {/* MOBILE */}
            <div className="md:hidden flex items-center mr-4 gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
                {/* REMOVIDO: Mostrar zero para debug - agora só mostra badge quando tem itens */}
              </button>

              {isLogged ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="p-1 hover:bg-muted rounded-lg transition-colors"
                  >
                    <UserCircle className="w-7 h-7" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-card shadow-lg rounded-lg border z-50">
                      <a
                        href="/perfil"
                        className="block px-4 py-2 hover:bg-muted transition-colors"
                      >
                        Meu Perfil
                      </a>
                      <a
                        href="/meus-bilhetes"
                        className="block px-4 py-2 hover:bg-muted transition-colors"
                      >
                        Meus Bilhetes
                      </a>
                      <div className="border-t border-border">
                        <LogoutButton />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <AuthButtons />
              )}

              <MenuButton />
            </div>
          </div>
        </div>
      </header>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Navbar;