// app/profile/page.tsx
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets'>('profile');
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);

  // Hooks customizados
  const { qrCodeLoaded, generateQRCode } = useQRCode();
  const {
    loading,
    error,
    apiTickets,
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
        
        if (session.token) {
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
        } else {
          console.error('Usuário não autenticado');
        }
      } catch (err) {
        console.error('Erro ao carregar sessão:', err);
      }
    }
    
    loadUserSession();
  }, []);

  // ================================
  // GERAR QR CODE EM TEMPO REAL
  // ================================
  const generateQRCodeRealTime = async (ticket: any): Promise<string> => {
    setGeneratingQR(ticket.id);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const qrData = JSON.stringify({
          ticketId: ticket.originalData.ticketId,
          paymentId: ticket.originalData.paymentId,
          eventId: ticket.originalData.eventId,
          ticketType: ticket.originalData.type,
          quantity: ticket.originalData.quantity,
          purchaseDate: ticket.originalData.paymentDate,
          reference: ticket.paymentReference,
          user: userData?.email || userData?.name || 'Usuário',
          timestamp: new Date().toISOString()
        });

        const qrCode = generateQRCode(qrData);
        setGeneratingQR(null);
        resolve(qrCode);
      }, 500);
    });
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
    const ticket = localTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    setSelectedTicket(ticket);
    
    // Se já tem QR Code, apenas abre o modal
    if (ticket.qrCode) {
      setQrModalOpen(true);
      return;
    }

    // Gera QR Code em tempo real
    if (qrCodeLoaded) {
      const newQrCode = await generateQRCodeRealTime(ticket);
      
      // Atualiza o ticket com o novo QR Code
      updateTicketQRCode(ticketId, newQrCode);
      
      // Atualiza o ticket selecionado
      setSelectedTicket({ ...ticket, qrCode: newQrCode });
      setQrModalOpen(true);
    }
  };

  const handleGenerateQR = async (ticketId: string) => {
    if (!qrCodeLoaded) {
      console.warn('QR Code library not loaded yet');
      return;
    }

    const ticket = localTickets.find(t => t.id === ticketId);
    if (!ticket) {
      console.warn('Bilhete não encontrado para gerar QR Code:', ticketId);
      return;
    }

    const newQrCode = await generateQRCodeRealTime(ticket);
    updateTicketQRCode(ticketId, newQrCode);
  };

  const handleDownload = (ticketId: string) => {
    const ticket = localTickets.find(t => t.id === ticketId);
    if (!ticket || !ticket.qrCode) return;

    try {
      const link = document.createElement('a');
      link.href = ticket.qrCode;
      link.download = `bilhete-${ticket.ticketCode}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
    }
  };

  const handleShare = async (ticketId: string) => {
    const ticket = localTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    try {
      const shareText = `🎫 Meu bilhete para ${ticket.eventName}\n📅 Data: ${ticket.eventDate}\n📍 Local: ${ticket.eventLocation}\n🎪 Tipo: ${ticket.ticketType}\n💰 Valor: ${ticket.price} MZN\n🔗 Código: ${ticket.ticketCode}`;

      if (navigator.share) {
        await navigator.share({
          title: `Bilhete - ${ticket.eventName}`,
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Informações do bilhete copiadas para a área de transferência! 📋');
      }
    } catch (err) {
      console.log('Erro ao partilhar:', err);
    }
  };

  const handleRefreshTickets = () => {
    loadUserTickets();
  };

  // ================================
  // CALCULAR ESTATÍSTICAS
  // ================================
  const getFavoriteCategory = (): string => {
    if (apiTickets.length === 0) return 'Geral';
    
    const categories = apiTickets.reduce((acc, ticket) => {
      const category = ticket.type.toLowerCase();
      acc[category] = (acc[category] || 0) + ticket.quantity;
      return acc;
    }, {} as Record<string, number>);

    const favorite = Object.entries(categories).reduce((max, [category, count]) => 
      count > max.count ? { category, count } : max, 
      { category: 'Geral', count: 0 }
    );

    return favorite.category.charAt(0).toUpperCase() + favorite.category.slice(1);
  };

  const stats = {
    totalTickets: summary.totalTickets,
    upcomingEvents: localTickets.filter(t => t.status === 'active').length,
    totalSpent: summary.totalAmount,
    favoriteCategory: getFavoriteCategory()
  };

  // ================================
  // RENDER
  // ================================
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <ProfileHeader userProfile={userProfile} />

        {/* Stats - Só mostra se houver bilhetes */}
        {apiTickets.length > 0 && <Stats {...stats} />}

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
                  {localTickets.filter(t => t.status === 'active').length}
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

        {/* Modal de QR Code */}
        <QRModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          ticket={selectedTicket}
          onDownload={() => selectedTicket && handleDownload(selectedTicket.id)}
          onShare={() => selectedTicket && handleShare(selectedTicket.id)}
          onGenerateQR={() => selectedTicket && handleGenerateQR(selectedTicket.id)}
          generatingQR={selectedTicket ? generatingQR === selectedTicket.id : false}
        />
      </div>
    </div>
  );
}