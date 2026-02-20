// components/profile/QrModdal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export interface LocalTicket {
  id: string;
  ticketId: string;
  ticketCode: string;
  ticketType: string;
  ticketName: string;
  price: number;
  expiresAt: string;
  
  // Dados do evento
  eventId: string;
  eventName: string;
  eventDescription: string;
  eventLocation: string;
  eventImage: string;
  eventProvince: string;
  eventDate: string;
  eventTime: string;
  
  // Dados de compra
  purchaseDate: string;
  quantity: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentReference: string;
  
  // Status e QR Code
  status: 'active' | 'expired' | 'pending';
  qrCode?: string;
}

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: LocalTicket | null;
  userData?: {
    name?: string;
    email?: string;
    username?: string;
  };
  onDownload: () => void;
  onShare: () => void;
  onGenerateQR: () => void;
  generatingQR: boolean;
}

export function QRModal({ 
  isOpen, 
  onClose, 
  ticket, 
  userData,
  onDownload, 
  onShare, 
  onGenerateQR,
  generatingQR 
}: QRModalProps) {
  const [fullscreen, setFullscreen] = useState(false);

  if (!ticket) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-MZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'expired':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'expired':
        return 'Expirado';
      default:
        return status;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`
                ${fullscreen 
                  ? 'fixed inset-4 bg-white dark:bg-gray-900 rounded-3xl' 
                  : 'max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl'
                }
                shadow-2xl overflow-hidden
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Simples */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {fullscreen ? 'QR Code em Tela Cheia' : 'Meu QR Code'}
                  </h2>
                  <button
                    onClick={() => setFullscreen(!fullscreen)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    {fullscreen ? (
                      <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Main Content - Foco no QR Code */}
              <div className={`
                ${fullscreen 
                  ? 'h-[calc(100vh-130px)] overflow-y-auto p-8' 
                  : 'p-6'
                }
              `}>
                {/* Informação mínima do evento */}
                <div className="text-center mb-6">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                    {ticket.eventName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {ticket.eventLocation} • {formatDate(ticket.expiresAt)}
                  </p>
                </div>

                {/* QR Code - Simples e Grande */}
                <div className="flex justify-center mb-6">
                  {generatingQR ? (
                    <div className={`
                      ${fullscreen ? 'w-96 h-96' : 'w-64 h-64'}
                      bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center
                    `}>
                      <RefreshCw className="w-12 h-12 animate-spin text-gray-400" />
                    </div>
                  ) : ticket.qrCode ? (
                    <div 
                      className={`
                        ${fullscreen ? 'w-96 h-96' : 'w-64 h-64'}
                        bg-white p-4 rounded-2xl shadow-lg cursor-pointer
                      `}
                      onClick={() => setFullscreen(true)}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={ticket.qrCode}
                          alt="QR Code"
                          fill
                          className="object-contain"
                          sizes={fullscreen ? "384px" : "256px"}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={`
                      ${fullscreen ? 'w-96 h-96' : 'w-64 h-64'}
                      bg-gray-100 dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center gap-4 p-6
                    `}>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        QR Code não disponível
                      </p>
                      <button
                        onClick={onGenerateQR}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Gerar QR Code
                      </button>
                    </div>
                  )}
                </div>

                {/* Código do Bilhete em Destaque */}
                {ticket.qrCode && (
                  <div className="text-center mb-6">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Código do Bilhete
                    </p>
                    <p className="font-mono text-2xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 py-3 px-4 rounded-xl inline-block">
                      {ticket.ticketCode}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`}></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {getStatusText(ticket.status)}
                  </span>
                </div>

                {/* Instrução de uso */}
                {ticket.status === 'active' && ticket.qrCode && (
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
                    Mostre este código na entrada do evento para validação.
                    {fullscreen && ' Aproxime o leitor para escanear facilmente.'}
                  </p>
                )}
              </div>

              {/* Ações Simples */}
              {ticket.qrCode && (
                <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={onDownload}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={onShare}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                    >
                      <Share2 className="w-4 h-4" />
                      Partilhar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}