"use client"
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Languages, Calendar, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const mockMentor = {
  id: '1',
  name: 'Maria Santos',
  title: 'Senior Software Engineer',
  company: 'Tech Solutions Mozambique',
  experience: 8,
  rating: 4.9,
  price: 350,
  location: 'Maputo, Matola',
  categories: ['Desenvolvimento Web', 'JavaScript', 'React', 'Node.js'],
  image: '/images/avatar.jpg',
  description: 'Especialista em desenvolvimento full-stack com 8 anos de experiência em startups e empresas de tecnologia. Já trabalhei em projetos internacionais e locais, sempre focando em soluções escaláveis e de alta qualidade.',
  bio: `Com mais de 8 anos de experiência no mercado de tecnologia, já liderei equipes de desenvolvimento e participei de projetos que impactaram milhares de usuários. Minha paixão é ajudar desenvolvedores a crescerem em suas carreiras e dominarem as tecnologias mais modernas do mercado.

Principais competências:
• Desenvolvimento Full-Stack (React, Node.js, TypeScript)
• Arquitetura de Software
• Metodologias Ágeis
• Mentoria de Carreira em TI`,
  availability: [
    { date: '2025-01-20', slots: ['18:00-19:00', '19:00-20:00', '20:00-21:00'] },
    { date: '2025-01-21', slots: ['18:00-19:00', '19:00-20:00'] },
    { date: '2025-01-22', slots: ['18:00-19:00', '20:00-21:00'] },
    { date: '2025-01-23', slots: ['18:00-19:00', '19:00-20:00', '20:00-21:00'] },
    { date: '2025-01-24', slots: ['18:00-19:00'] },
    { date: '2025-01-25', slots: ['18:00-19:00', '19:00-20:00'] },
    { date: '2025-01-26', slots: ['18:00-19:00', '20:00-21:00'] },
    { date: '2025-01-27', slots: ['10:00-11:00', '11:00-12:00'] },
    { date: '2025-01-28', slots: ['10:00-11:00', '15:00-16:00'] },
    { date: '2025-01-29', slots: ['18:00-19:00', '19:00-20:00', '20:00-21:00'] },
    { date: '2025-01-30', slots: ['18:00-19:00', '19:00-20:00'] },
    { date: '2025-01-31', slots: ['18:00-19:00', '20:00-21:00'] },
    { date: '2025-02-11', slots: ['18:00-19:00', '20:00-21:00'] },
  ],
  languages: ['Português', 'Inglês'],
  isOnline: true,
  isLocal: true,
  reviews: [
    { id: 1, user: 'João Silva', rating: 5, comment: 'Excelente mentora! Me ajudou muito com React e TypeScript. As sessões são muito produtivas e ela explica conceitos complexos de forma simples.', date: '2025-01-15' },
    { id: 2, user: 'Ana Costa', rating: 5, comment: 'Muito conhecimento prático e didática incrível. Já implementei várias das dicas que recebi e estou vendo resultados no meu trabalho.', date: '2025-01-10' },
    { id: 3, user: 'Carlos Mendes', rating: 5, comment: 'A Maria é fantástica! Me ajudou a preparar para entrevistas técnicas e consegui uma oferta de emprego incrível. Super recomendo!', date: '2025-01-08' },
    { id: 4, user: 'Sofia Nhampossa', rating: 4, comment: 'Boa mentora, muito paciente e com grande conhecimento técnico. As sessões são bem estruturadas.', date: '2025-01-05' },
    { id: 5, user: 'David Manhique', rating: 5, comment: 'Transformou minha maneira de pensar sobre arquitetura de software. Estou muito mais confiante no meu trabalho.', date: '2025-01-02' },
    { id: 6, user: 'Lúcia Tembe', rating: 5, comment: 'Incrível! Não só me ensinou React como também me ajudou a montar um portfólio que chamou atenção de várias empresas.', date: '2023-12-28' },
  ]
};

interface Params {
  params: {
    id: string;
  };
}

export default function MentorDetailPage({ params }: Params) {
  const mentor = mockMentor;
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    // Encontrar a primeira data disponível do mentor
    if (mentor.availability.length > 0) {
      const firstAvailableDate = new Date(mentor.availability[0].date);
      return new Date(firstAvailableDate.getFullYear(), firstAvailableDate.getMonth(), 1);
    }
    // Se não houver disponibilidade, usar o mês atual
    return new Date();
  });

  // Encontrar a primeira data disponível para seleção automática
  useEffect(() => {
    if (mentor.availability.length > 0 && !selectedDate) {
      setSelectedDate(mentor.availability[0].date);
    }
  }, [mentor.availability, selectedDate]);

  // Gerar calendário do mês atual
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    // Dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, ...)
    const firstDayOfWeek = firstDay.getDay();

    const days = [];

    // Dias do mês anterior (para preencher o início)
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: date.toISOString().split('T')[0],
        isCurrentMonth: false,
        isAvailable: false
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isAvailable = mentor.availability.some(a => a.date === dateString);

      days.push({
        date: dateString,
        isCurrentMonth: true,
        isAvailable
      });
    }

    // Dias do próximo mês (para preencher o final)
    const totalCells = 42; // 6 semanas * 7 dias
    const nextMonthDays = totalCells - days.length;
    for (let day = 1; day <= nextMonthDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date: date.toISOString().split('T')[0],
        isCurrentMonth: false,
        isAvailable: false
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('pt-BR', { month: 'long' }),
      weekday: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
      full: date.toLocaleDateString('pt-BR')
    };
  };

  const getAvailableSlotsForDate = (date: string) => {
    const availability = mentor.availability.find(a => a.date === date);
    return availability ? availability.slots : [];
  };

  // Verificar se há disponibilidade no mês atual
  const hasAvailabilityInCurrentMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return mentor.availability.some(avail => {
      const date = new Date(avail.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  // Encontrar o próximo mês com disponibilidade
  const findNextAvailableMonth = (direction: 'prev' | 'next') => {
    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();

    let year = currentYear;
    let month = currentMonthNum;
    let attempts = 0;
    const maxAttempts = 24; // Limitar a 2 anos para frente/trás

    while (attempts < maxAttempts) {
      if (direction === 'next') {
        month++;
        if (month > 11) {
          month = 0;
          year++;
        }
      } else {
        month--;
        if (month < 0) {
          month = 11;
          year--;
        }
      }

      const hasAvailability = mentor.availability.some(avail => {
        const date = new Date(avail.date);
        return date.getFullYear() === year && date.getMonth() === month;
      });

      if (hasAvailability) {
        return new Date(year, month, 1);
      }

      attempts++;
    }

    return currentMonth; // Retorna o mês atual se não encontrar
  };

  const calendarDays = generateCalendar();
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Container>
      <div className="py-8">
        <Link href="/eventos" className="text-primary hover:underline mb-6 inline-block">
          ← Voltar para mentores
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <div className="relative h-64 w-full mb-4">
                  <Image
                    src={mentor.image}
                    alt={`Foto de ${mentor.name}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="text-center">
                  <h1 className="text-2xl font-bold text-muted-foreground dark:text-white">
                    {mentor.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {mentor.title} • {mentor.company}
                  </p>

                  <div className="flex items-center justify-center text-yellow-500 mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-1 font-medium">{mentor.rating.toFixed(1)}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {mentor.experience} anos
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {mentor.location}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                      <Languages className="w-4 h-4 mr-2" />
                      {mentor.languages.join(', ')}
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-bold text-secondary">
                      MT {mentor.price.toFixed(2)}
                    </span>
                    <span className="text-gray-500 ml-1">/hora</span>
                  </div>


                </div>
              </div>

              {/* Availability Calendar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-secondary" />
                    Disponibilidade
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(findNextAvailableMonth('prev'))}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="w-4 h-4 text-secondary" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-32 text-center">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(findNextAvailableMonth('next'))}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="w-4 h-4 text-secondary" />
                    </Button>
                  </div>
                </div>

                {/* Indicador de disponibilidade no mês */}
                {!hasAvailabilityInCurrentMonth() && (
                  <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-300 text-center">
                    Nenhuma disponibilidade neste mês
                  </div>
                )}

                {/* Calendar Grid */}
                <div className="mb-4">
                  {/* Week Days Header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(day => (
                      <div key={day} className="text-xs text-gray-500 dark:text-gray-400 text-center py-1 font-medium">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const formattedDate = formatDate(day.date);
                      const isSelected = selectedDate === day.date;
                      const isToday = new Date().toDateString() === new Date(day.date).toDateString();

                      return (
                        <button
                          key={index}
                          onClick={() => day.isAvailable && setSelectedDate(day.date)}
                          disabled={!day.isAvailable}
                          className={`
                            relative h-10 rounded-lg text-sm font-medium transition-all duration-200
                            ${!day.isCurrentMonth
                              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                              : day.isAvailable
                                ? isSelected
                                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                  : isToday
                                    ? 'bg-secondary text-white shadow-sm'
                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }
                          `}
                        >
                          {formattedDate.day}

                          {/* Availability Dot */}
                          {day.isAvailable && day.isCurrentMonth && (
                            <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-secondary'
                              }`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span>Disponível</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <span>Indisponível</span>
                  </div>
                </div>

                {/* Selected Date Slots */}
                {selectedDate && (
                  <div className="mt-4 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                      Horários disponíveis - {formatDate(selectedDate).weekday}, {formatDate(selectedDate).full}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailableSlotsForDate(selectedDate).map((slot, index) => (
                        <div
                          key={index}
                          className="text-xs bg-white dark:bg-gray-700 border border-secondary text-gray-600 dark:text-secondary-foreground py-2 px-3 rounded text-center font-medium hover:bg-secondary hover:text-white dark:hover:bg-secondary transition-colors duration-200 cursor-pointer"
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Link href={`/eventos/agendar/${mentor.id}`}>
                  <Button className="w-full mt-4  bg-primary text-primary-foreground hover:bg-primary/90">
                    Agendar Sessão
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">Sobre</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {mentor.description}
              </p>
              <div className="prose dark:prose-invert max-w-none">
                {mentor.bio.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Specialties */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">Áreas</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.categories.map((category) => (
                  <Badge key={category} className="bg-primary text-primary-foreground px-3 py-1">
                    {category}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Avaliações</h2>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="ml-1 font-medium">{mentor.rating.toFixed(1)}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {mentor.reviews.length} avaliações
                  </span>
                </div>
              </div>

              {/* Reviews Scroll */}
              <div
                ref={reviewsRef}
                className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              >
                {mentor.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {review.user.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white block">
                            {review.user}
                          </span>
                          <span className="text-xs text-gray-600">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm font-medium">{review.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pl-11">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* Scroll Indicator */}
              {mentor.reviews.length > 3 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Role para ver mais avaliações ↓
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #D1D5DB;
          border-radius: 3px;
        }
        
        .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #4B5563;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </Container>
  );
}