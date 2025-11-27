// components/profile/QRModal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, RefreshCw, User, Mail, Calendar, MapPin, Clock, Ticket } from 'lucide-react';

export interface LocalTicket {
  paymentReference: any;
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketCode: string;
  quantity: number;
  ticketType: string;
  price: number;
  purchaseDate: string;
  status: 'active' | 'used' | 'pending';
  qrCode: string;
  paymentMethod: string;
  paymentStatus: string;
  originalData: any;
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
  if (!ticket) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'used':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'used':
        return 'Utilizado';
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
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-background to-muted/50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header com gradiente */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-0 ">
                <div className="flex items-center justify-end">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Seção Esquerda - Informações do Usuário e Evento */}
                    <div className="space-y-6">
                      
                      {/* Card do Usuário */}
                      

                      {/* Card do Evento */}
                      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          Informações do Evento
                        </h3>
                        <div className="space-y-4">
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Data do Evento</p>
                              <p className="font-medium text-foreground">
                                {formatDate(ticket.eventDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Horário</p>
                              <p className="font-medium text-foreground">
                                {ticket.eventTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Horário</p>
                              <p className="font-medium text-foreground">
                                {ticket.quantity} {ticket.quantity === 1 ? 'bilhete' : 'bilhetes'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Local</p>
                              <p className="font-medium text-foreground">
                                {ticket.eventLocation}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Local</p>
                              <p className="font-medium text-foreground">
                                {ticket.ticketCode}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* Seção Direita - QR Code e Detalhes do Bilhete */}
                    <div className="space-y-6">
                      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
                        <div className="flex justify-center mb-6">
                          {ticket.qrCode ? (
                            <div className="bg-white p-6 rounded-2xl border-2 border-border shadow-lg">
                              <img 
                                src={ticket.qrCode} 
                                alt={`QR Code do bilhete ${ticket.ticketCode}`}
                                className="w-64 h-64"
                              />
                            </div>
                          ) : (
                            <div className="w-64 h-64 bg-muted/50 rounded-2xl border-2 border-dashed border-border flex items-center justify-center flex-col gap-4">
                              {generatingQR ? (
                                <>
                                  <RefreshCw className="w-12 h-12 animate-spin text-muted-foreground" />
                                  <p className="text-muted-foreground text-center font-medium">
                                    Gerando QR Code...
                                  </p>
                                </>
                              ) : (
                                <>
                                  
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer com Ações */}
              <div className="border-t border-border/50 bg-muted/20 p-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Bilhete válido para entrada no evento
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={onDownload}
                      disabled={!ticket.qrCode}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={onShare}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-all duration-200 hover:scale-105 font-medium"
                    >
                      <Share2 className="w-4 h-4" />
                      Partilhar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}