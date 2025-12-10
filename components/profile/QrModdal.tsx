// components/profile/QrModdal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, RefreshCw, User, Mail, Calendar, MapPin, Clock, Ticket, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

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
  qrCode: string;
  
  // Dados originais
  originalData: {
    paymentId: string;
    ticketId: string;
    eventId: string;
    type: string;
    quantity: number;
    paymentDate: string;
    ticketUser?: {
      code: string;
    };
    event?: {
      id: string;
      title: string;
      description: string;
      location: string;
      img: string;
      province: string;
    };
  };
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
  const [expandedSection, setExpandedSection] = useState<'user' | 'event' | 'ticket' | 'qr'>('qr');
  
  if (!ticket) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-MZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-MZ', {
        day: 'numeric',
        month: 'numeric',
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

  const getPaymentMethodText = (method: string) => {
    switch (method.toLowerCase()) {
      case 'mpesa':
        return 'M-Pesa';
      case 'tranfer':
      case 'transfer':
        return 'Transferência';
      case 'card':
      case 'cartão':
        return 'Cartão';
      default:
        return method;
    }
  };

  const toggleSection = (section: 'user' | 'event' | 'ticket' | 'qr') => {
    setExpandedSection(expandedSection === section ? 'qr' : section);
  };

  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    section 
  }: { 
    title: string; 
    icon: any; 
    section: 'user' | 'event' | 'ticket' | 'qr' 
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 hover:bg-muted/50 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {expandedSection === section ? (
        <ChevronUp className="w-5 h-5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );

  // Usar dados do evento do originalData se disponíveis
  const eventData = ticket.originalData?.event || {
    title: ticket.eventName,
    description: ticket.eventDescription,
    location: ticket.eventLocation,
    img: ticket.eventImage,
    province: ticket.eventProvince
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
              className="bg-gradient-to-br from-background to-muted/50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header com gradiente */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Bilhete Digital
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      {ticket.eventName}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Conteúdo com scroll */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="p-6 space-y-4">
                  
                  {/* Seção do Usuário - Colapsável */}
                  <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                    <SectionHeader 
                      title="Detalhes do Participante" 
                      icon={User} 
                      section="user" 
                    />
                    <AnimatePresence>
                      {expandedSection === 'user' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Nome</p>
                                <p className="font-medium text-foreground">
                                  {userData?.name || userData?.username || 'Não informado'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium text-foreground">
                                  {userData?.email || 'Não informado'}
                                </p>
                              </div>
                            </div>

                            {/* Código do Ticket */}
                            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                              <Ticket className="w-4 h-4 text-primary" />
                              <div>
                                <p className="text-sm text-muted-foreground">Código do Ticket</p>
                                <p className="font-mono font-bold text-primary">
                                  {ticket.ticketCode}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Seção do Evento - Colapsável */}
                  <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                    <SectionHeader 
                      title="Informações do Evento" 
                      icon={Calendar} 
                      section="event" 
                    />
                    <AnimatePresence>
                      {expandedSection === 'event' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="space-y-4">
                            {eventData.img && (
                              <div className="mb-4">
                                <img 
                                  src={eventData.img} 
                                  alt={eventData.title}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                              </div>
                            )}

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
                              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-green-500" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Local</p>
                                <p className="font-medium text-foreground">
                                  {eventData.location}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {eventData.province}
                                </p>
                              </div>
                            </div>

                            {eventData.description && (
                              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                                <p className="text-foreground">{eventData.description}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Seção do QR Code - Sempre visível */}
                  <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Código QR
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`}></div>
                        {getStatusText(ticket.status)}
                      </div>
                    </div>

                    <div className="flex justify-center mb-6">
                      {ticket.qrCode ? (
                        <div className="bg-white p-6 rounded-2xl border-2 border-border shadow-lg">
                          <img 
                            src={ticket.qrCode} 
                            alt={`QR Code do bilhete ${ticket.ticketCode}`}
                            className="w-48 h-48"
                          />
                        </div>
                      ) : (
                        <div className="w-48 h-48 bg-muted/50 rounded-2xl border-2 border-dashed border-border flex items-center justify-center flex-col gap-4">
                          {generatingQR ? (
                            <>
                              <RefreshCw className="w-12 h-12 animate-spin text-muted-foreground" />
                              <p className="text-muted-foreground text-center font-medium">
                                Gerando QR Code...
                              </p>
                            </>
                          ) : (
                            <>
                              <Ticket className="w-12 h-12 text-muted-foreground" />
                              <div className="text-center">
                                <p className="text-muted-foreground font-medium mb-2">
                                  QR Code não disponível
                                </p>
                                <button
                                  onClick={onGenerateQR}
                                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                >
                                  Gerar QR Code
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Código do Bilhete */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Código do Bilhete
                      </p>
                      <p className="font-mono text-xl font-bold text-foreground bg-muted/30 py-2 px-4 rounded-lg">
                        {ticket.ticketCode}
                      </p>
                    </div>
                  </div>

                  {/* Seção de Detalhes do Bilhete - Colapsável */}
                  <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                    <SectionHeader 
                      title="Detalhes da Compra" 
                      icon={CreditCard} 
                      section="ticket" 
                    />
                    <AnimatePresence>
                      {expandedSection === 'ticket' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="text-muted-foreground">Tipo de Bilhete</p>
                              <p className="font-medium text-foreground capitalize">
                                {ticket.ticketName} ({ticket.ticketType})
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-muted-foreground">Preço</p>
                              <p className="font-medium text-foreground text-green-600">
                                {formatCurrency(ticket.price)}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-muted-foreground">Quantidade</p>
                              <p className="font-medium text-foreground">
                                {ticket.quantity}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-muted-foreground">Método de Pagamento</p>
                              <p className="font-medium text-foreground capitalize">
                                {getPaymentMethodText(ticket.paymentMethod)}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-muted-foreground">Status Pagamento</p>
                              <p className={`font-medium ${
                                ticket.paymentStatus === 'confirmed' ? 'text-green-600' : 
                                ticket.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {ticket.paymentStatus === 'confirmed' ? 'Confirmado' : 
                                 ticket.paymentStatus === 'pending' ? 'Pendente' : 'Cancelado'}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-muted-foreground">Data de Expiração</p>
                              <p className="font-medium text-foreground">
                                {formatDateTime(ticket.expiresAt)}
                              </p>
                            </div>

                            <div className="space-y-1 col-span-2">
                              <p className="text-muted-foreground">Data da Compra</p>
                              <p className="font-medium text-foreground">
                                {ticket.purchaseDate}
                              </p>
                            </div>

                            {ticket.paymentReference && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-muted-foreground">Referência de Pagamento</p>
                                <p className="font-mono font-medium text-foreground">
                                  {ticket.paymentReference}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Footer com Ações */}
              <div className="border-t border-border/50 bg-muted/20 p-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)} animate-pulse`}></div>
                    {ticket.status === 'active' 
                      ? 'Bilhete válido para entrada no evento' 
                      : ticket.status === 'pending'
                      ? 'Aguardando confirmação do pagamento'
                      : 'Bilhete expirado'
                    }
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