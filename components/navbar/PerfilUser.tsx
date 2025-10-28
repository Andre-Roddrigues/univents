"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoutButton } from "../LogoutButton";
import { LogOut } from "lucide-react";

interface props {
  user: any;
  status?: string;
}
export default function PerfilUser() {
  const pathname = usePathname();

  const [imageUrl, setImageUrl] = useState<string>();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function criarSiglas(name: string, lastName: string): string {
    if (!name || !lastName) return "";
    const inicialNome = name.charAt(0).toUpperCase();
    const inicialApelido = lastName.charAt(0).toUpperCase();
    return inicialNome + inicialApelido;
  }

  // useEffect(() => {
  //   const fetchAlunoData = async () => {
  //     if (status === "authenticated" && userId) {
  //       const token = user?.accessToken;
  //       try {
  //         const userData = await l ;
  //         if (userData?.FotoAlunos && userData.FotoAlunos.length > 0) {
  //           setImageUrl(userData.FotoAlunos[0].url);
  //         }
  //       } catch (error) {
  //         console.error("Erro ao buscar aluno", error);
  //       }
  //     }
  //   };

  //   fetchAlunoData();
  // }, [status, userId]);

  // const siglas = criarSiglas(user?.name, user?.lastName);

  const handleToggleDropdown = () => {
    if (pathname !== "/user/perfil") {
      setDropdownOpen(!dropdownOpen);
    }
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Verifica se o clique foi no botão "Sair"
      if (target.dataset.action === "logout") return;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false); // Fecha o dropdown apenas se o clique for fora
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // if (!user) {
  //   return null;
  // }

  return (
    <div className="relative">
      <div
        onClick={handleToggleDropdown}
        className="cursor-pointer font-semibold text-sm bg-border p-0.5 py-0  rounded-full flex gap-3 items-center"
      >
        {/* <span className="text-sm pl-3 hidden md:block">Meu Perfil</span> */}
        <Avatar className="h-4/5 aspect-square">
          <AvatarImage src={imageUrl || " "} />
          {/* <AvatarFallback>{siglas}</AvatarFallback> */}
        </Avatar>
      </div>

      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-32 bg-background rounded-md shadow-lg z-50"
        >
          <ul className="py-2">
            {/* <li>
              <Link
                href="/user/perfil"
                className="block px-4 py-2 text-xs  hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Meu Perfil
              </Link>
            </li> */}
            {/* <li>
              <Link
                href=""
                className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Meus Cursos
              </Link>
            </li> */}
            <li>
              <LogoutButton data-action="logout">
                <div className=" flex items-center justify-between  hover:bg-gray-100 w-full px-4">
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
