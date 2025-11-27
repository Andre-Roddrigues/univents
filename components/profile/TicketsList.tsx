// components/profile/TicketsList.tsx
'use client';

import { motion } from 'framer-motion';
import SessionCard from '@/components/profile/SessionCard';
import { LocalTicket } from './QrModdal';

interface TicketsListProps {
  loading: boolean;
  error: string | null;
  localTickets: LocalTicket[];
  summary: {
    totalTickets: number;
    confirmedTickets: number;
    pendingTickets: number;
    totalAmount: number;
  };
  generatingQR: string | null;
  onRefreshTickets: () => void;
  onGenerateQR: (ticketId: string) => void;
  onDownload: (ticketId: string) => void;
  onShare: (ticketId: string) => void;
  onViewQRCode: (ticketId: string) => void;
}

export function TicketsList({
  loading,
  error,
  localTickets,
  summary,
  generatingQR,
  onRefreshTickets,
  onGenerateQR,
  onDownload,
  onShare,
  onViewQRCode
}: TicketsListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">A carregar bilhetes...</p>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={onRefreshTickets}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!loading && !error && localTickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🎫</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Nenhum bilhete encontrado
        </h3>
        <p className="text-muted-foreground mb-6">
          Ainda não compraste bilhetes para nenhum evento.
        </p>
        <a
          href="/eventos"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Explorar Eventos
        </a>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header com resumo */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Meus Bilhetes ({localTickets.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            {summary.confirmedTickets} confirmados • {summary.pendingTickets} pendentes • Total gasto: {summary.totalAmount} MZN
          </p>
        </div>
        <button
          onClick={onRefreshTickets}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
        >
          <span>🔄</span>
          Actualizar
        </button>
      </div>

      {/* Tickets */}
      {localTickets.map((ticket, index) => (
        <SessionCard
          key={ticket.id}
          ticket={ticket}
          onGenerateQR={onGenerateQR}
          onDownload={onDownload}
          onShare={onShare}
          onViewQRCode={onViewQRCode}
          generatingQR={generatingQR === ticket.id}
        />
      ))}
    </motion.div>
  );
}