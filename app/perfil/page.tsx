// app/profile/page.tsx (parte da geração do QR code)
'use client';

import { useState, useEffect } from 'react';
import { getSession } from '@/lib/actions/getSession';
import { useTickets } from '@/hooks/useTickets';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { TicketsList } from '@/components/profile/TicketsList';
import PerfilForm from '@/components/profile/ProfileForm';
import Stats from '@/components/profile/StatsCards';
import { QRModal } from '@/components/profile/QrModdal';
import { useQRCode } from '@/hooks/useQrCode';
import type { LocalTicket } from '@/components/profile/QrModdal';
import { Ticket } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets'>('profile');
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<LocalTicket | null>(null);
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);

  // Hooks customizados
  const { qrCodeLoaded, generateUltraSimpleQRCode } = useQRCode();
  
  // Usar o hook useTickets que já cuida de toda a lógica
  const {
    loading,
    error,
    apiItems,
    localTickets,
    summary,
    loadUserTickets,
    updateTicketQRCode
  } = useTickets(token);

  // Dados do perfil
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: ''
  });

  // ================================
  // CARREGAR SESSÃO E DADOS DO USUÁRIO
  // ================================
  useEffect(() => {
    async function loadUserSession() {
      try {
        const session = await getSession();
        
        if (session?.token) {
          setToken(session.token);
          
          // Decodificar o token JWT para obter dados do usuário
          try {
            const payload = JSON.parse(atob(session.token.split('.')[1]));
            setUserData(payload);
            
            // Preencher dados básicos do perfil
            setUserProfile(prev => ({
              ...prev,
              name: payload.name || payload.username || '',
              email: payload.email || '',
            }));
          } catch (decodeError) {
            console.error('Erro ao decodificar token:', decodeError);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar sessão:', err);
      }
    }
    
    loadUserSession();
  }, []);

  // ================================
  // GERAR QR CODE SIMPLES (MENOS BARRAS)
  // ================================
  // No handleViewQRCode ou handleGenerateQR:
const generateSimpleQR = async (ticket: LocalTicket): Promise<string> => {
  setGeneratingQR(ticket.id);
  
  try {
    // Usar o gerador ultra simples com apenas o código
    // Isso resulta em um QR code com poucas barras e bem grossas
    const qrCode = generateUltraSimpleQRCode(ticket.ticketCode);
    
    setGeneratingQR(null);
    return qrCode;
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    setGeneratingQR(null);
    throw error;
  }
};

  // ================================
  // HANDLERS DE AÇÕES
  // ================================
  const handleSaveProfile = async (profile: any) => {
    try {
      setUserProfile(profile);
      console.log('Perfil atualizado:', profile);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  const handleViewQRCode = async (ticketId: string) => {
    try {
      const ticket = localTickets.find(t => t.id === ticketId);
      if (!ticket) return;

      setSelectedTicket(ticket);
      
      // Se já tem QR Code, apenas abre o modal
      if (ticket.qrCode) {
        setQrModalOpen(true);
        return;
      }

      // Verificar se a biblioteca QR está carregada
      if (!qrCodeLoaded) {
        console.warn('Aguardando carregamento da biblioteca QR...');
        setTimeout(() => handleViewQRCode(ticketId), 500);
        return;
      }

      // Gera QR Code simples
      const newQrCode = await generateSimpleQR(ticket);
      
      // Atualiza o ticket com o novo QR Code
      updateTicketQRCode(ticketId, newQrCode);
      
      // Atualiza o ticket selecionado
      setSelectedTicket({ ...ticket, qrCode: newQrCode });
      setQrModalOpen(true);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      alert('Não foi possível gerar o QR Code. Tente novamente.');
    }
  };

  const handleGenerateQR = async (ticketId: string) => {
    try {
      if (!qrCodeLoaded) {
        throw new Error('Biblioteca QR não carregada');
      }

      const ticket = localTickets.find(t => t.id === ticketId);
      if (!ticket) {
        throw new Error('Bilhete não encontrado');
      }

      const newQrCode = await generateSimpleQR(ticket);
      updateTicketQRCode(ticketId, newQrCode);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      alert('Falha ao gerar QR Code. Por favor, tente novamente.');
    }
  };

  const handleDownload = (ticketId: string) => {
    try {
      const ticket = localTickets.find(t => t.id === ticketId);
      if (!ticket || !ticket.qrCode) {
        throw new Error('QR Code não disponível');
      }

      const link = document.createElement('a');
      link.href = ticket.qrCode;
      link.download = `bilhete-${ticket.ticketCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      alert('Não foi possível baixar o QR Code.');
    }
  };

  const handleShare = async (ticketId: string) => {
    try {
      const ticket = localTickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const eventDate = new Date(ticket.expiresAt).toLocaleDateString('pt-MZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const shareText = `🎫 ${ticket.eventName}\n📅 ${eventDate}\n📍 ${ticket.eventLocation}\n💰 ${ticket.price} MZN\n🔗 Código: ${ticket.ticketCode}`;

      if (navigator.share) {
        await navigator.share({
          title: `Bilhete - ${ticket.eventName}`,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Informações copiadas! 📋');
      }
    } catch (err) {
      console.log('Erro ao partilhar:', err);
    }
  };

  const handleRefreshTickets = () => {
    loadUserTickets();
  };

  // ================================
  // CALCULAR ESTATÍSTICAS COM DADOS REAIS
  // ================================
  const getStats = () => {
    if (localTickets.length === 0) {
      return {
        totalTickets: 0,
        upcomingEvents: 0,
        totalSpent: 0,
        favoriteCategory: 'Nenhum',
        favoriteEvent: 'Nenhum',
        totalEvents: 0
      };
    }

    const categories = localTickets.reduce((acc, ticket) => {
      const category = ticket.ticketName;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteCategory = Object.entries(categories).reduce((max, [category, count]) => 
      count > max.count ? { category, count } : max, 
      { category: 'Nenhum', count: 0 }
    ).category;

    const events = localTickets.reduce((acc, ticket) => {
      const eventName = ticket.eventName;
      acc[eventName] = (acc[eventName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteEvent = Object.entries(events).reduce((max, [eventName, count]) => 
      count > max.count ? { eventName, count } : max, 
      { eventName: 'Nenhum', count: 0 }
    ).eventName;

    const uniqueEvents = new Set(localTickets.map(ticket => ticket.eventName));
    const totalSpent = localTickets.reduce((sum, ticket) => sum + ticket.price, 0);

    return {
      totalTickets: summary.totalTickets,
      upcomingEvents: summary.activeTickets,
      totalSpent: summary.totalAmount,
      favoriteCategory,
      favoriteEvent,
      totalEvents: uniqueEvents.size
    };
  };

  // ================================
  // RENDER
  // ================================
  const stats = getStats();

  // Componente para quando não há bilhetes
  const NoTicketsMessage = () => (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
        <Ticket className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        Nenhum bilhete encontrado
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
        Você ainda não comprou nenhum bilhete. Explore os eventos disponíveis e garanta o seu lugar!
      </p>
      <button 
        onClick={() => window.location.href = '/eventos'}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Ver eventos disponíveis
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <ProfileHeader userProfile={userProfile} />

        {/* Stats - Só mostra se houver bilhetes */}
        {localTickets.length > 0 && <Stats {...stats} />}

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors relative ${
              activeTab === 'tickets'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Meus Bilhetes 
            {localTickets.length > 0 && (
              <>
                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {summary.activeTickets}
                </span>
                {summary.pendingTickets > 0 && (
                  <span className="ml-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    {summary.pendingTickets}
                  </span>
                )}
              </>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'profile' ? (
          <PerfilForm
            profile={userProfile}
            onSave={handleSaveProfile}
            onCancel={() => {}}
          />
        ) : (
          <>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <p className="text-red-600 dark:text-red-400 text-center">
                  Erro ao carregar bilhetes. Tente novamente mais tarde.
                </p>
              </div>
            )}

            {!loading && localTickets.length === 0 ? (
              <NoTicketsMessage />
            ) : (
              <TicketsList
                loading={loading}
                error={error}
                localTickets={localTickets}
                summary={summary}
                generatingQR={generatingQR}
                onRefreshTickets={handleRefreshTickets}
                onGenerateQR={handleGenerateQR}
                onDownload={handleDownload}
                onShare={handleShare}
                onViewQRCode={handleViewQRCode}
              />
            )}
          </>
        )}

        {/* Modal de QR Code */}
        <QRModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          ticket={selectedTicket}
          userData={userData}
          onDownload={() => selectedTicket && handleDownload(selectedTicket.id)}
          onShare={() => selectedTicket && handleShare(selectedTicket.id)}
          onGenerateQR={() => selectedTicket && handleGenerateQR(selectedTicket.id)}
          generatingQR={selectedTicket ? generatingQR === selectedTicket.id : false}
        />
      </div>
    </div>
  );
}