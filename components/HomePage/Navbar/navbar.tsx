"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, X, Briefcase, GraduationCap, Info, User, FileText, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import logo from "/public/images/prometlogo.png";
import Image from "next/image";
import LogoutButton from "./LogoutButton";
import Logo from "@/components/navbar/Logo";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Início");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const menuItems = [
    { name: "Início", href: "/", icon: Briefcase },
    { name: "Sobre", href: "/#sobre", icon: Briefcase },
    { name: "Áreas de Formação", href: "/cursos", icon: GraduationCap  },
    { name: "Como Funciona", href: "/#funcionamento", icon: Info  },
    { name: "Benefícios", href: "/#beneficios", icon: Briefcase },
    { name: "Contacto", href: "/#contacto", icon: Briefcase },
  ];

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  // Função para verificar se existe token
  const checkAuthToken = () => {
    const hasAuthToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return !!hasAuthToken;
  };

  useEffect(() => {
    // Tema
    if (localStorage.getItem("theme") === "light") {
      document.documentElement.classList.add("light");
      setDarkMode(true);
    }

    // Verificar se existe sessão pelo cookie
    setIsLoggedIn(checkAuthToken());

    // Configurar verificação contínua do token
    const authCheckInterval = setInterval(() => {
      setIsLoggedIn(checkAuthToken());
    }, 1000); // Verifica a cada segundo

    // Limpar intervalo quando componente desmontar
    return () => clearInterval(authCheckInterval);
  }, []);

  // Escutar mudanças no storage (caso logout em outra aba)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(checkAuthToken());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setDarkMode(true);
    }
  };

  const handleNavigation = (name: string) => {
    setActiveLink(name);
    setIsMobileOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Links desktop */}
        <div className="hidden md:flex space-x-8 font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-brand-main dark:hover:text-brand-lime transition"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-4">
          {/* Só aparece se NÃO estiver logado */}
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border dark:border-brand-lime dark:text-white border-brand-main text-brand-main font-medium hover:bg-brand-main hover:text-white transition"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="px-4 py-2 rounded-lg bg-brand-main text-white font-medium hover:bg-brand-main/90 transition"
              >
                Registro
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Dropdown de perfil */}
              <LogoutButton />
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <User className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
                
                {/* Dropdown menu */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700"
                    >
                      <Link
                        href="/user/perfil"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        <span>Perfil</span>
                      </Link>
                      <Link
                        href="/user/candidaturas"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        <span>Candidaturas</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Botão de dark mode */}
          {/* <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-105 transition"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            )}
          </button> */}

          {/* Botão menu mobile */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Fundo escuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-screen bg-black/70 z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-screen w-80 bg-white dark:bg-gray-900 shadow-xl z-50 md:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileSidebarVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center bg-white justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-brand-lime flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-bold text-brand-main dark:text-white">
                    PROMET
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 bg-white px-4 py-6">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeLink === item.name;

                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => handleNavigation(item.name)}
                          className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-brand-main/10 to-brand-lime/10 text-brand-main dark:text-brand-lime border-r-2 border-brand-main"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                  
                  {/* Links de perfil na versão mobile */}
                  {isLoggedIn && (
                    <>
                      <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          href="/user/perfil"
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <User className="w-5 h-5 mr-3" />
                          <span className="font-medium">Meu Perfil</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/user/candidaturas"
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <FileText className="w-5 h-5 mr-3" />
                          <span className="font-medium">Minhas Candidaturas</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;