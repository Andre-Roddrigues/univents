import React, { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SearchField from "./SearchField";
import Link from "next/link";
import { navLinks } from "./Navlinks";

function MenuButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col w-full">
        {/* <DropdownMenuLabel>Pesquisar</DropdownMenuLabel> */}
        <DropdownMenuSeparator />
        {navLinks.map((link) => (
          <DropdownMenuItem>
            <Link
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MenuButton;
