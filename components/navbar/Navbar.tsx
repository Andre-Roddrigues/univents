"use client";

import React, { useEffect, useState } from "react";
import { navLinks } from "./Navlinks";
import NavItem from "./NavbarItem";
import Logo from "./Logo";
import MenuButton from "./MenuButton";
import AuthButtons from "./AuthButtons";
import { UserCircle, ShoppingCart } from "lucide-react";
import CartModal from "./CartModal";

function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    console.log("📌 [Navbar] Cookies atuais:", document.cookie);

    // pega cookie token OU session
    const cookieString = document.cookie;

    const extractedToken = cookieString
      .split("; ")
      .find((c) => c.startsWith("token=") || c.startsWith("session="));

    console.log("🔍 [Navbar] Cookie encontrado:", extractedToken);

    const hasToken = !!extractedToken;

    console.log("✅ [Navbar] Usuário logado?", hasToken);

    setIsLogged(hasToken);

    // --- CONTAGEM DO CARRINHO ---
    const updateCartCount = () => {
      const storedCart = localStorage.getItem("eventCart");
      const cartItems = storedCart ? JSON.parse(storedCart) : [];
      const totalItems = cartItems.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      );
      setCartItemsCount(totalItems);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

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

              {/* BOTÃO DO CARRINHO */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* PERFIL OU LOGIN */}
              {isLogged ? (
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <UserCircle className="w-7 h-7" />
                </button>
              ) : (
                <AuthButtons />
              )}
            </div>

            {/* MOBILE */}
            <div className="md:hidden flex items-center mr-4 gap-4">
              {/* CARRINHO MOBILE */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* PERFIL OU LOGIN */}
              {isLogged ? (
                <UserCircle className="w-7 h-7" />
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
