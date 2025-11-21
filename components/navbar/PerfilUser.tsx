"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogoutButton } from "../LogoutButton";
import { LogOut } from "lucide-react";

interface PerfilUserProps {
  user: {
    name: string;
    lastName: string;
    email?: string;
    imageUrl?: string;
  };
  status?: string;
}

export default function PerfilUser({ user }: PerfilUserProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function criarSiglas(name: string, lastName: string): string {
    if (!name || !lastName) return "";
    const inicialNome = name.charAt(0).toUpperCase();
    const inicialApelido = lastName.charAt(0).toUpperCase();
    return inicialNome + inicialApelido;
  }

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.dataset.action === "logout") return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const siglas = criarSiglas(user.name, user.lastName);

  return (
    <div className="relative">
      <div
        onClick={handleToggleDropdown}
        className="cursor-pointer font-semibold text-sm bg-border p-0.5 py-0 rounded-full flex gap-3 items-center"
      >
        <Avatar className="h-4/5 aspect-square">
          {user.imageUrl ? (
            <AvatarImage src={user.imageUrl} />
          ) : (
            <AvatarFallback>{siglas}</AvatarFallback>
          )}
        </Avatar>
      </div>

      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-32 bg-background rounded-md shadow-lg z-50"
        >
          <ul className="py-2">
            <li>
              <LogoutButton data-action="logout">
                <div className="flex items-center justify-between hover:bg-gray-100 w-full px-4">
                  <LogOut />
                  <span className="cursor-pointer block w-full text-left px-4 py-2 text-xs">
                    Sair
                  </span>
                </div>
              </LogoutButton>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
