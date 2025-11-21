"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, X, AlertCircle } from "lucide-react";

const LogoutButton = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    // Apaga o cookie session
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Fecha o modal
    setIsModalOpen(false);

    // Redireciona e faz refresh
    router.refresh();
    await router.push("/");
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <LogOut size={18} />
      </button>

      {/* Modal de Confirmação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 h-screen flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="text-red-500" size={20} />
                Confirmação de Saída
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="my-4">
              <p className="text-gray-600 dark:text-gray-300">
                Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente.
              </p>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium flex items-center gap-2"
              >
                <LogOut size={16} />
                Sim, Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
