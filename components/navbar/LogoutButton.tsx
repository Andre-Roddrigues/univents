"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, AlertCircle, X } from "lucide-react";
import { removeSession } from "@/lib/actions/removesession";

function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);


const handleLogout = async () => {
  setIsLoggingOut(true);

  await removeSession();

  window.location.href = "/login";
};



  return (
    <>
      {/* Botão normal */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg font-medium"
      >
        <LogOut className="w-4 h-4" />
        Sair da Conta
      </motion.button>

      {/* Modal (mantido igual ao teu) */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => !isLoggingOut && setShowModal(false)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto border border-gray-200 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-rose-50">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-red-100 flex items-center justify-center">
                      <AlertCircle className="w-7 h-7 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Sair da Conta?
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Você será desconectado deste dispositivo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  {/* Barra de progresso */}
                  {isLoggingOut && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-6"
                    >
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1 }}
                          className="h-full bg-red-500 rounded-full"
                        />
                      </div>
                      <p className="text-center text-sm text-gray-600 mt-2">
                        Saindo da conta...
                      </p>
                    </motion.div>
                  )}

                  {/* Botões */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowModal(false)}
                      disabled={isLoggingOut}
                      className="flex-1 border border-gray-300 rounded-xl py-3 font-medium"
                    >
                      <X className="w-4 h-4 inline" /> Cancelar
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex-1 bg-red-500 text-white rounded-xl py-3 font-medium shadow-md"
                    >
                      Confirmar
                    </motion.button>
                  </div>
                </div>

                <div className="p-4 text-center text-xs text-gray-500 bg-gray-50">
                  Suas informações permanecem seguras.
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default LogoutButton;
