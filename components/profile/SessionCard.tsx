// components/profile/SessionCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Download, Share2, QrCode, Ticket as TicketIcon, CreditCard } from 'lucide-react';
import type { LocalTicket } from './QrModdal';

interface SessionCardProps {
  ticket: LocalTicket;
  onGenerateQR: (ticketId: string) => void;
  onDownload: (ticketId: string) => void;
  onShare: (ticketId: string) => void;
  onViewQRCode: (ticketId: string) => void;
  generatingQR?: boolean;
}

export default function SessionCard({ 
  ticket, 
  onGenerateQR, 
  onDownload, 
  onShare, 
  onViewQRCode,
  generatingQR = false 
}: SessionCardProps) {
  
  // Função para formatar data
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-MZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Função para formatar data e hora
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

  // Função para formatar moeda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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

  // Usar dados do evento do originalData se disponíveis
  const eventData = ticket.originalData?.event || {
    title: ticket.eventName,
    description: ticket.eventDescription,
    location: ticket.eventLocation,
    img: ticket.eventImage,
    province: ticket.eventProvince
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300 ${
        ticket.status === 'expired' ? 'opacity-70 hover:opacity-90' : ''
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Coluna da Esquerda - Imagem e Informações Básicas */}
        {eventData.img && (
          <div className="lg:w-1/4">
            <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
              <img 
                src={eventData.img} 
                alt={eventData.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Informações rápidas */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <TicketIcon className="w-4 h-4 text-primary" />
                <span className="font-medium">{ticket.ticketName}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                  {getStatusText(ticket.status)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span>{getPaymentMethodText(ticket.paymentMethod)}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  ticket.paymentStatus === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ticket.paymentStatus === 'confirmed' ? 'Pago' : 'Pendente'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Coluna Central - Informações Detalhadas */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {eventData.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {eventData.description}
              </p>
            </div>
            
            {/* Código do Ticket */}
            <div className="text-right">
              <div className="text-2xl font-bold text-primary mb-1 font-mono">
                {ticket.ticketCode}
              </div>
              <div className="text-sm text-muted-foreground">
                Código do Ticket
              </div>
            </div>
          </div>

          {/* Detalhes do Evento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Data</p>
                <p className="font-medium">{ticket.eventDate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Horário</p>
                <p className="font-medium">{ticket.eventTime}</p>
              </div>
            </div>
            
            <div className="md:col-span-2 flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <MapPin className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Local</p>
                <p className="font-medium">{eventData.location}</p>
                <p className="text-xs text-muted-foreground">{eventData.province}</p>
              </div>
            </div>
          </div>

          {/* Detalhes do Bilhete */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
            <div className="p-2 bg-card border border-border rounded">
              <p className="text-xs text-muted-foreground">Tipo</p>
              <p className="font-medium capitalize">{ticket.ticketType}</p>
            </div>
            
            <div className="p-2 bg-card border border-border rounded">
              <p className="text-xs text-muted-foreground">Preço</p>
              <p className="font-medium text-green-600">{formatCurrency(ticket.price)}</p>
            </div>
            
            <div className="p-2 bg-card border border-border rounded">
              <p className="text-xs text-muted-foreground">Quantidade</p>
              <p className="font-medium">{ticket.quantity}</p>
            </div>
            
            <div className="p-2 bg-card border border-border rounded">
              <p className="text-xs text-muted-foreground">Expira em</p>
              <p className="font-medium">{formatDate(ticket.expiresAt)}</p>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="text-xs text-muted-foreground">
            <p>Comprado em: {ticket.purchaseDate}</p>
            {ticket.paymentReference && (
              <p>Referência: {ticket.paymentReference}</p>
            )}
          </div>
        </div>

        {/* Coluna da Direita - Ações */}
        <div className="flex lg:flex-col gap-2">
          <button
            onClick={() => onViewQRCode(ticket.id)}
            disabled={generatingQR || ticket.status === 'expired'}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              ticket.status === 'expired' 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {generatingQR ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                Ver QR
              </>
            )}
          </button>
          
          <button
            onClick={() => onDownload(ticket.id)}
            disabled={!ticket.qrCode || ticket.status === 'expired'}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              !ticket.qrCode || ticket.status === 'expired'
                ? 'border border-border text-muted-foreground cursor-not-allowed' 
                : 'border border-primary text-primary hover:bg-primary/10'
            }`}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          
          <button
            onClick={() => onShare(ticket.id)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium text-sm"
          >
            <Share2 className="w-4 h-4" />
            Partilhar
          </button>
        </div>
      </div>

      {/* Seção do QR Code (expandível) */}
      {ticket.qrCode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-6 border-t border-border"
        >
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold text-foreground mb-4">
              QR Code do Bilhete
            </h4>
            
            <div className="bg-white p-4 rounded-lg border border-border mb-4 shadow-sm">
              <img 
                src={ticket.qrCode} 
                alt={`QR Code do bilhete ${ticket.ticketCode}`}
                className="w-48 h-48 mx-auto"
              />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Apresente este código QR na entrada do evento
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {ticket.ticketCode}
              </p>
            </div>

            {/* Mini Ações para o QR Code */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => onDownload(ticket.id)}
                className="flex items-center gap-2 px-3 py-1 text-xs border border-border rounded hover:bg-muted transition-colors"
              >
                <Download className="w-3 h-3" />
                Baixar QR
              </button>
              <button
                onClick={() => onShare(ticket.id)}
                className="flex items-center gap-2 px-3 py-1 text-xs border border-border rounded hover:bg-muted transition-colors"
              >
                <Share2 className="w-3 h-3" />
                Partilhar
              </button>
              <button
                onClick={() => onGenerateQR(ticket.id)}
                className="flex items-center gap-2 px-3 py-1 text-xs border border-border rounded hover:bg-muted transition-colors"
              >
                <QrCode className="w-3 h-3" />
                Gerar Novo
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Seção para gerar QR Code se não existir e o ticket estiver ativo */}
      {/* {!ticket.qrCode && ticket.status === 'active' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-dashed border-border"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              QR Code ainda não gerado para este bilhete
            </p>
            <button
              onClick={() => onGenerateQR(ticket.id)}
              disabled={generatingQR}
              className="flex items-center justify-center gap-2 px-4 py-2 mx-auto bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {generatingQR ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Gerando QR Code...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  Gerar QR Code
                </>
              )}
            </button>
          </div>
        </motion.div>
      )} */}

      {/* Mensagem para tickets expirados */}
      {ticket.status === 'expired' && (
        <div className="mt-4 pt-4 border-t border-red-200">
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p>Este bilhete expirou em {formatDate(ticket.expiresAt)}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}