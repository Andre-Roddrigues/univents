"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full px-6 py-12 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          {/* Ícone de livro estilizado */}
          <div className="mx-auto w-24 h-24 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-blue-600"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            Página não encontrada
          </h2>

          <div className="mt-4 border-t border-dashed border-gray-300 pt-4">
            <p className="text-gray-600 mb-6">
              A página que você está a procura pode ter sido removida, renomeada
              ou talvez nunca tenha existido.
            </p>
          </div>

          <div className="mt-8 flex flex-col space-y-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Voltar à página anterior
            </button>

            <Link
              href="/"
              className="px-4 py-2 w-full border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition duration-300"
            >
              Ir para a página inicial
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>
              Precisa de ajuda? Entre em contato com nossa equipe de suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
