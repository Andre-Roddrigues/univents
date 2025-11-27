'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Download, Share2, QrCode } from 'lucide-react';

interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketCode: string;
  ticketType: string;
  price: number;
  quantity: number;
  purchaseDate: string;
  status: 'active' | 'used' | 'pending' | 'cancelled';
  qrCode?: string;
}

interface SessionCardProps {
  ticket: Ticket;
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'used':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'used':
        return 'Utilizado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Event Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {ticket.eventName}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {getStatusText(ticket.status)}
              </span>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary mb-1">
                {ticket.ticketCode}
              </div>
              <div className="text-sm text-muted-foreground">
                Código do Bilhete
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(ticket.eventDate)}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{ticket.eventTime}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground md:col-span-2">
              <MapPin className="w-4 h-4" />
              <span>{ticket.eventLocation}</span>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Tipo:</span> {ticket.ticketType}
            </div>
            <div>
              <span className="font-medium">Preço:</span> {ticket.price} MZN
            </div>
            <div>
              <span className="font-medium">Quantidade:</span> {ticket.quantity}
            </div>
            <div>
              <span className="font-medium">Comprado em:</span> {formatDate(ticket.purchaseDate)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col gap-2">
          <button
            onClick={() => onViewQRCode(ticket.id)}
            disabled={generatingQR}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            {generatingQR ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                Ver QR Code
              </>
            )}
          </button>
          
          <button
            onClick={() => onDownload(ticket.id)}
            disabled={!ticket.qrCode}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
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

      {/* QR Code Section - Mostra o QR Code gerado originalmente */}
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
            
            <div className="bg-white p-4 rounded-lg border border-border mb-4">
              {/* QR Code Image Original */}
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
              <p className="text-xs text-muted-foreground">
                Código: <span className="font-mono font-medium">{ticket.ticketCode}</span>
              </p>
            </div>

            {/* Mini Actions */}
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
            </div>
          </div>
        </motion.div>
      )}

      {/* Seção para gerar QR Code se não existir */}
      {!ticket.qrCode && ticket.status === 'active' && (
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
      )}
    </motion.div>
  );
}