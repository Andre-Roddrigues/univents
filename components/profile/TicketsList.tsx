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
    activeTickets: number;
    expiredTickets: number;
    totalAmount: number;
    pendingTickets: number;
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
  
  console.log('🔍 TicketsList - localTickets:', localTickets);
  console.log('🔍 TicketsList - summary:', summary);
  console.log('🔍 TicketsList - loading:', loading);
  console.log('🔍 TicketsList - error:', error);

  // Função para formatar moeda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

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
    console.log('📭 Nenhum bilhete encontrado, mas sem erro');
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

  console.log('✅ Renderizando', localTickets.length, 'bilhetes');

  // Filtrar tickets ativos e expirados para exibição
  const activeTickets = localTickets.filter(t => t.status === 'active');
  const expiredTickets = localTickets.filter(t => t.status === 'expired');
  const pendingTickets = localTickets.filter(t => t.status === 'pending');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header com resumo */}
      <div className="bg-gradient-to-r from-background to-muted/20 p-4 rounded-2xl border border-border">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Resumo dos Bilhetes
            </h3>
            <p className="text-sm text-muted-foreground">
              Gerencia todos os teus bilhetes comprados
            </p>
          </div>
          <button
            onClick={onRefreshTickets}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50"
          >
            <span>🔄</span>
            Actualizar
          </button>
        </div>
        
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-card p-3 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{summary.totalTickets}</p>
          </div>
          <div className="bg-card p-3 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">Ativos</p>
            <p className="text-2xl font-bold text-green-600">{summary.activeTickets}</p>
          </div>
          <div className="bg-card p-3 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">Expirados</p>
            <p className="text-2xl font-bold text-red-600">{summary.expiredTickets}</p>
          </div>
          <div className="bg-card p-3 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">Total Gasto</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(summary.totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      {localTickets.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium whitespace-nowrap">
            Todos ({localTickets.length})
          </button>
          <button className="px-4 py-2 bg-card hover:bg-muted rounded-full text-sm font-medium whitespace-nowrap border border-border">
            Ativos ({activeTickets.length})
          </button>
          <button className="px-4 py-2 bg-card hover:bg-muted rounded-full text-sm font-medium whitespace-nowrap border border-border">
            Expirados ({expiredTickets.length})
          </button>
          {pendingTickets.length > 0 && (
            <button className="px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 rounded-full text-sm font-medium whitespace-nowrap border border-yellow-500/20">
              Pendentes ({pendingTickets.length})
            </button>
          )}
        </div>
      )}

      {/* Lista de Tickets */}
      {activeTickets.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Bilhetes Ativos ({activeTickets.length})
          </h4>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {activeTickets.map((ticket) => (
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
          </div>
        </div>
      )}

      {expiredTickets.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Bilhetes Expirados ({expiredTickets.length})
          </h4>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 opacity-60">
            {expiredTickets.map((ticket) => (
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
          </div>
        </div>
      )}

      {pendingTickets.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            Bilhetes Pendentes ({pendingTickets.length})
          </h4>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {pendingTickets.map((ticket) => (
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
          </div>
        </div>
      )}

      {/* Indicador de scroll se houver muitos tickets */}
      {localTickets.length > 10 && (
        <div className="text-center mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Mostrando {localTickets.length} bilhetes
          </p>
        </div>
      )}
    </motion.div>
  );
}