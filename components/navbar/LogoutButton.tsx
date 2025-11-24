"use client";

import React from "react";

function LogoutButton() {
  const handleLogout = () => {
    console.log("🔐 Realizando logout...");

    // Remove cookies manualmente
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    document.cookie =
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

    // Redirecionar
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
    >
      Sair
    </button>
  );
}

export default LogoutButton;
