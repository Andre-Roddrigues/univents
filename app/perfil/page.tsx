'use client';

import { useState, useMemo } from 'react';
import { StatsCards } from '@/components/profile/StatsCards';
import { SessionCard } from '@/components/profile/SessionCard';
import { ProfileForm } from '@/components/profile/ProfileForm';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tab';
import { User, Booking, BookingStats } from '@/types/user';
import { Calendar, User as UserIcon, Settings } from 'lucide-react';
export const dynamic = "force-dynamic";


// Mock data - substitua por chamada à API
const mockUser: User = {
    id: '1',
    name: 'Andre Jr',
    email: 'andre.jr@email.com',
    phone: '+258 84 123 4567',
    avatar: '/images/mentorhero.jpg',
    location: 'Maputo, Moçambique',
    bio: 'Desenvolvedor web apaixonado por tecnologia e sempre em busca de aprendizado contínuo.',
    preferences: {
        notifications: true,
        emailUpdates: true,
        smsReminders: false,
    },
    createdAt: '2024-01-01',
};

const mockBookings: Booking[] = [
    {
        id: '1',
        mentorId: '1',
        mentorName: 'Andre RN',
        mentorAvatar: '/images/avatar.jpg',
        mentorTitle: 'Senior Software Engineer',
        date: '2024-01-25',
        startTime: '18:00',
        endTime: '19:00',
        duration: 60,
        status: 'confirmed',
        price: 350,
        paymentMethod: 'mpesa',
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        notes: 'Preparar perguntas sobre React hooks'
    },
    {
        id: '2',
        mentorId: '2',
        mentorName: 'Andre Jr',
        mentorAvatar: '/images/avatar.jpg',
        mentorTitle: 'Product Manager',
        date: '2024-01-20',
        startTime: '14:00',
        endTime: '15:00',
        duration: 60,
        status: 'completed',
        price: 280,
        paymentMethod: 'card',
        rating: 5,
        review: 'Excelente sessão! Aprendi muito sobre gestão de produto.'
    },
    {
        id: '3',
        mentorId: '3',
        mentorName: 'ARN',
        mentorAvatar: '/images/avatar.jpg',
        mentorTitle: 'Digital Marketing Specialist',
        date: '2024-01-15',
        startTime: '16:00',
        endTime: '17:00',
        duration: 60,
        status: 'completed',
        price: 220,
        paymentMethod: 'emola',
        rating: 4
    },
    {
        id: '4',
        mentorId: '4',
        mentorName: 'Andre Novela',
        mentorAvatar: '/images/avatar.jpg',
        mentorTitle: 'Data Scientist',
        date: '2024-01-10',
        startTime: '19:00',
        endTime: '20:00',
        duration: 60,
        status: 'cancelled',
        price: 320,
        paymentMethod: 'comprovativo'
    }
];

export default function ProfilePage() {
    const [user, setUser] = useState<User>(mockUser);
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [activeTab, setActiveTab] = useState('upcoming');

    // Calcular estatísticas
    const stats: BookingStats = useMemo(() => {
        return {
            total: bookings.length,
            upcoming: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
            completed: bookings.filter(b => b.status === 'completed').length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length,
        };
    }, [bookings]);
    // Na página do perfil, atualize a função handleRate:
    const handleRate = async (booking: Booking, rating: number, review?: string) => {
        // Simular chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));

        setBookings(prev => prev.map(b =>
            b.id === booking.id ? {
                ...b,
                rating: rating,
                review: review
            } : b
        ));

        // Em produção, fazer chamada à API para salvar a avaliação
        console.log('Avaliação salva:', { bookingId: booking.id, rating, review });
    };
    // Filtrar sessões por tab ativa
    const filteredBookings = useMemo(() => {
        switch (activeTab) {
            case 'upcoming':
                return bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            case 'completed':
                return bookings.filter(b => b.status === 'completed')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            case 'cancelled':
                return bookings.filter(b => b.status === 'cancelled')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            case 'all':
                return bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            default:
                return bookings;
        }
    }, [bookings, activeTab]);

    const handleReschedule = (booking: Booking) => {
        // Implementar lógica de reagendamento
        console.log('Reagendar:', booking);
        alert(`Reagendar sessão com ${booking.mentorName}`);
    };

    const handleCancel = (booking: Booking) => {
        if (confirm(`Tem certeza que deseja cancelar a sessão com ${booking.mentorName}?`)) {
            setBookings(prev => prev.map(b =>
                b.id === booking.id ? { ...b, status: 'cancelled' } : b
            ));
        }
    };

    

    const handleSaveProfile = (userData: Partial<User>) => {
        setUser(prev => ({ ...prev, ...userData }));
        // Em produção, fazer chamada à API
        console.log('Salvar perfil:', userData);
    };

    return (
        <Container>
            <div className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Meu Perfil
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Gerencie suas sessões, dados pessoais e preferências
                    </p>
                </div>

                {/* Estatísticas */}
                <StatsCards stats={stats} />

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="upcoming" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Próximas
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4" />
                            Concluídas
                        </TabsTrigger>
                        <TabsTrigger value="cancelled" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Canceladas
                        </TabsTrigger>
                        <TabsTrigger value="all" className="flex items-center gap-2">
                            Todas
                        </TabsTrigger>
                    </TabsList>

                    {/* Aba de Sessões */}
                    <TabsContent value={activeTab} className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {activeTab === 'upcoming' && 'Próximas Sessões'}
                                {activeTab === 'completed' && 'Sessões Concluídas'}
                                {activeTab === 'cancelled' && 'Sessões Canceladas'}
                                {activeTab === 'all' && 'Todas as Sessões'}
                            </h2>
                            <span className="text-gray-600 dark:text-gray-400">
                                {filteredBookings.length} sessão
                            </span>
                        </div>

                        {filteredBookings.length > 0 ? (
                            <div className="space-y-4">
                                {filteredBookings.map((booking) => (
                                    <SessionCard
                                        key={booking.id}
                                        booking={booking}
                                        onReschedule={handleReschedule}
                                        onCancel={handleCancel}
                                        onRate={handleRate} // Agora recebe rating e review
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Nenhuma sessão encontrada
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {activeTab === 'upcoming'
                                        ? 'Você não tem sessões agendadas no momento.'
                                        : 'Nenhuma sessão nesta categoria.'
                                    }
                                </p>
                                {activeTab === 'upcoming' && (
                                    <Button>
                                        Encontrar Mentores
                                    </Button>
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Formulário de Perfil */}
                <div className="mt-12">
                    <ProfileForm user={user} onSave={handleSaveProfile} />
                </div>
            </div>
        </Container>
    );
}