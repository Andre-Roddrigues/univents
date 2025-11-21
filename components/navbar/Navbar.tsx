"use client";

import React, { useEffect, useState } from "react";
import { navLinks } from "./Navlinks";
import NavItem from "./NavbarItem";
import Logo from "./Logo";
import CartListButton from "../CartListButton";
import MenuButton from "./MenuButton";
import AuthButtons from "./AuthButtons";
import PerfilUser from "./PerfilUser";
import { UserSession } from "@/types/types";
import { UserCircle } from "lucide-react";

function Navbar() {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    // Pega o token do cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: payload.name,
          lastName: payload.lastname,
          email: payload.email,
          // imageUrl: "",
          role: payload.role,
        });
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  }, []);

  return (
    <header className="sticky font-playfair top-0 z-50 border-b bg-card shadow-sm">
      <div className="max-w-7xl mx-auto md:px-4 lg:px-0 w-full">
        <div className="flex h-16 items-center justify-between w-full px-2 md:px-4">
          <Logo />

          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link, index) => (
              <NavItem key={index} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? <UserCircle/> : <AuthButtons />}
            <CartListButton />
          </div>

          <div className="md:hidden flex items-center mr-4 gap-4">
            <CartListButton />
            <MenuButton />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
