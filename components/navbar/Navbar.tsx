import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/images/unibook-logo.png";
// import { CartListDropdown } from "../CartListDropdown";
import { navLinks } from "./Navlinks";
import NavItem from "./NavbarItem";
import Logo from "./Logo";
import SearchField from "./SearchField";
import CartListButton from "../CartListButton";
import MenuButton from "./MenuButton";
import { SearchPopover } from "./SearchPoppover";
import AuthButtons from "./AuthButtons";
import { UserSession } from "@/types/types";
import PerfilUser from "./PerfilUser";

interface NavbarProps {
  user: UserSession | null;
}

function Navbar() {
  return (
    <header className="sticky font-playfair top-0 z-50 border-b bg-card shadow-sm">
      <div className="max-w-7xl mx-auto md:px-4 lg:px-0  w-full  ">
        <div className="flex h-16 items-center justify-between w-full px-2 md:px-4">
          <Logo />
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link, index) => (
              <NavItem key={index} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex">
              <AuthButtons />
            </div>
            {/* <SearchPopover /> */}
            {/* <CartListButton /> */}
            <div
              className= "flex aspect-square rounded-full"
            >
              <PerfilUser />
            </div>
            {/* <CartListDropdown /> */}
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
