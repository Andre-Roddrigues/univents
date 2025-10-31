'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SessionCard from '@/components/profile/SessionCard';
import PerfilForm from '@/components/profile/ProfileForm';
import Stats from '@/components/profile/StatsCards';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets'>('profile');

  // Dados de exemplo
  const [userProfile, setUserProfile] = useState({
    name: 'Andre RN',
    email: 'andre.novela@email.com',
    phone: '+258 84 123 4567',
    location: 'Maputo, Moçambique',
    bio: 'Apaixonado por eventos de música e tecnologia. Sempre à procura da próxima experiência memorável!',
    avatar: ''
  });

  const [tickets, setTickets] = useState([
    {
      id: '1',
      eventName: 'Festival de Música Moçambique 2024',
      eventDate: '2024-02-15',
      eventTime: '20:00',
      eventLocation: 'Maputo, Praça da Independência',
      ticketCode: 'A1B2C3',
      ticketType: 'VIP',
      price: 500,
      purchaseDate: '2025-11-20',
      status: 'active' as const,
      qrCode: ''
    },
    {
      id: '2',
      eventName: 'Workshop de Tecnologia & Inovação',
      eventDate: '2025-12-18',
      eventTime: '09:00',
      eventLocation: 'Universidade Eduardo Mondlane',
      ticketCode: 'D4E5F6',
      ticketType: 'Normal',
      price: 250,
      purchaseDate: '2024-01-25',
      status: 'active' as const,
      qrCode: ''
    },
    {
      id: '3',
      eventName: 'Feira de Negócios 2024',
      eventDate: '2024-01-10',
      eventTime: '10:00',
      eventLocation: 'Centro de Conferências Joaquim Chissano',
      ticketCode: 'G7H8I9',
      ticketType: 'VIP',
      price: 5000,
      purchaseDate: '2023-12-15',
      status: 'used' as const,
      qrCode: ''
    }
  ]);

  const stats = {
    totalTickets: tickets.length,
    upcomingEvents: tickets.filter(t => t.status === 'active').length,
    totalSpent: tickets.reduce((sum, ticket) => sum + ticket.price, 0),
    favoriteCategory: 'Música'
  };

  const handleSaveProfile = (profile: any) => {
    setUserProfile(profile);
    // Aqui você faria a chamada API para atualizar o perfil
  };

  const handleGenerateQR = (ticketId: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, qrCode: `qr-code-${ticket.ticketCode}` }
        : ticket
    ));
  };

  const handleDownload = (ticketId: string) => {
    // Lógica para download do bilhete
    console.log('Download ticket:', ticketId);
  };

  const handleShare = (ticketId: string) => {
    // Lógica para partilhar bilhete
    console.log('Share ticket:', ticketId);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Meu Perfil
          </h1>
          <p className="text-xl text-muted-foreground">
            Gerir a tua conta e bilhetes de eventos
          </p>
        </motion.div>

        {/* Stats */}
        <Stats {...stats} />

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
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'tickets'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Meus Bilhetes ({tickets.filter(t => t.status === 'active').length})
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {tickets.map((ticket, index) => (
              <SessionCard
                key={ticket.id}
                ticket={ticket}
                onGenerateQR={handleGenerateQR}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}