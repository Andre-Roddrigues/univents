import { CheckCircle2, X } from "lucide-react";
import React from "react";

export default function SuccessOTP() {
  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0  backdrop-blur-md"></div>

      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-white/20 max-w-sm sm:max-w-md w-full animate-in fade-in duration-300">
        {/* Close button */}
        <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Verificação Concluída!
        </h1>

        <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
          Sua conta foi verificada com sucesso. Redirecionando...
        </p>

        <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
          <div className="bg-green-500 h-2 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// // Exemplo de uso com demonstração
// function App() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">
//           Demonstração do Modal
//         </h2>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Abrir Modal de Sucesso
//         </button>
//       </div>

//       <SuccessOTPModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div>
//   );
// }

// export default App;
