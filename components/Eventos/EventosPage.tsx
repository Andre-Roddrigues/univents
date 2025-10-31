'use client';

import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { useState, useMemo } from 'react';
import EventCard, { Event } from './EventCard';
import EventCategory, { Category } from './EventCategory';
import EventFilter, { DateFilter } from './EventFilter';
import router from 'next/router';

export default function AllEventsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const events = [
    {
      id: 1,
      title: 'Festival de Música Moçambique 2024',
      category: 'music',
      date: '2024-02-15',
      time: '20:00',
      location: 'Maputo, Praça da Independência',
      price: 500,
      image: '/images/event-music.jpg',
      ticketsLeft: 23,
      rating: 4.8,
      attendees: 1500,
      featured: true,
      organizer: 'Produtora Nacional',
      description: 'O maior festival de música do país com artistas nacionais e internacionais.'
    },
    {
      id: 2,
      title: 'Workshop de Tecnologia & Inovação Digital',
      category: 'tech',
      date: '2024-02-18',
      time: '09:00',
      location: 'Universidade Eduardo Mondlane',
      price: 250,
      image: '/images/event-tech.jpg',
      ticketsLeft: 45,
      rating: 4.6,
      attendees: 200,
      featured: false,
      organizer: 'Tech Community MZ',
      description: 'Workshop prático sobre as últimas tendências em tecnologia e inovação.'
    },
    {
      id: 3,
      title: 'Feira de Negócios e Empreendedorismo 2024',
      category: 'business',
      date: '2024-02-20',
      time: '10:00',
      location: 'Centro de Conferências Joaquim Chissano',
      price: 750,
      image: '/images/event-business.jpg',
      ticketsLeft: 12,
      rating: 4.9,
      attendees: 800,
      featured: true,
      organizer: 'Associação de Negócios',
      description: 'Conecte-se com investidores e descubra oportunidades de negócio.'
    },
    {
      id: 4,
      title: 'Exposição de Arte Contemporânea Moçambicana',
      category: 'art',
      date: '2024-02-22',
      time: '14:00',
      location: 'Museu de Arte de Maputo',
      price: 150,
      image: '/images/event-art.jpg',
      ticketsLeft: 67,
      rating: 4.7,
      attendees: 300,
      featured: false,
      organizer: 'Colectivo Artístico',
      description: 'Mostra dos melhores artistas contemporâneos de Moçambique.'
    },
    {
      id: 5,
      title: 'Conferência Nacional de Educação Digital',
      category: 'education',
      date: '2024-02-25',
      time: '08:30',
      location: 'Instituto Superior de Ciências e Tecnologia',
      price: 300,
      image: '/images/event-education.jpg',
      ticketsLeft: 89,
      rating: 4.5,
      attendees: 150,
      featured: false,
      organizer: 'Ministério da Educação',
      description: 'Discussão sobre o futuro da educação e tecnologia em Moçambique.'
    },
    {
      id: 6,
      title: 'Festival Gastronómico Sabores de Moçambique',
      category: 'food',
      date: '2024-02-28',
      time: '12:00',
      location: 'Feira Popular de Maputo',
      price: 200,
      image: '/images/event-food.jpg',
      ticketsLeft: 34,
      rating: 4.8,
      attendees: 500,
      featured: true,
      organizer: 'Associação de Chefs',
      description: 'Descubra a riqueza da gastronomia moçambicana com chefs renomados.'
    },
    {
      id: 7,
      title: 'Maratona da Cidade de Maputo',
      category: 'sports',
      date: '2024-03-01',
      time: '06:00',
      location: 'Avenida Marginal',
      price: 100,
      image: '/images/event-sports.jpg',
      ticketsLeft: 156,
      rating: 4.6,
      attendees: 2000,
      featured: false,
      organizer: 'Federação de Atletismo',
      description: 'Participe na maior maratona anual da capital moçambicana.'
    },
    {
      id: 8,
      title: 'Semana da Moda Moçambicana',
      category: 'fashion',
      date: '2024-03-05',
      time: '19:00',
      location: 'Hotel Polana Serena',
      price: 600,
      image: '/images/event-fashion.jpg',
      ticketsLeft: 28,
      rating: 4.7,
      attendees: 400,
      featured: true,
      organizer: 'Designers Nacionais',
      description: 'Desfiles com os melhores designers e novas tendências da moda local.'
    },
    {
      id: 9,
      title: 'Workshop de Fotografia Digital',
      category: 'workshop',
      date: '2024-03-08',
      time: '10:00',
      location: 'Centro Cultural Brasil-Moçambique',
      price: 400,
      image: '/images/event-workshop.jpg',
      ticketsLeft: 15,
      rating: 4.9,
      attendees: 50,
      featured: false,
      organizer: 'Fotógrafos Profissionais',
      description: 'Aprenda técnicas avançadas de fotografia com profissionais experientes.'
    }
  ];

  const categories: Category[] = [
    { key: 'all', label: 'Todos os Eventos', count: events.length },
    { key: 'music', label: 'Música', count: events.filter(e => e.category === 'music').length },
    { key: 'tech', label: 'Tecnologia', count: events.filter(e => e.category === 'tech').length },
    { key: 'business', label: 'Negócios', count: events.filter(e => e.category === 'business').length },
    { key: 'art', label: 'Arte & Cultura', count: events.filter(e => e.category === 'art').length },
    { key: 'education', label: 'Educação', count: events.filter(e => e.category === 'education').length },
    { key: 'food', label: 'Gastronomia', count: events.filter(e => e.category === 'food').length },
    { key: 'sports', label: 'Desporto', count: events.filter(e => e.category === 'sports').length },
    { key: 'fashion', label: 'Moda', count: events.filter(e => e.category === 'fashion').length },
    { key: 'workshop', label: 'Workshops', count: events.filter(e => e.category === 'workshop').length }
  ];

  const dateFilters: DateFilter[] = [
    { key: 'all', label: 'Todas as Datas' },
    { key: 'today', label: 'Hoje' },
    { key: 'week', label: 'Esta Semana' },
    { key: 'month', label: 'Este Mês' },
    { key: 'upcoming', label: 'Próximos' }
  ];

  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by category
    if (activeFilter !== 'all') {
      filtered = filtered.filter(event => event.category === activeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(event => 
      event.price >= priceRange[0] && event.price <= priceRange[1]
    );

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.attendees - a.attendees;
        default:
          return 0;
      }
    });

    return filtered;
  }, [activeFilter, searchQuery, priceRange, sortBy]);

const handleBuyTicket = (eventId: number) => {
  router.push(`/comprar/${eventId}`);
};

  const handleResetFilters = () => {
    setActiveFilter('all');
    setSearchQuery('');
    setPriceRange([0, 2000]);
    setDateFilter('all');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Todos os <span className="text-primary">Eventos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descobre e participa nos melhores eventos em Moçambique
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Filters */}
          <EventFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            dateFilters={dateFilters}
            onResetFilters={handleResetFilters}
          />

          {/* Categories */}
          <EventCategory
            categories={categories}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Results Info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Mostrando <span className="font-semibold text-foreground">{filteredEvents.length}</span> eventos
              {activeFilter !== 'all' && ` em ${categories.find(c => c.key === activeFilter)?.label}`}
            </p>
          </div>

          {/* Events Grid/List */}
          {viewMode === 'grid' ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  viewMode={viewMode}
                  categories={categories}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="space-y-4"
            >
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  viewMode={viewMode}
                  categories={categories}
                  index={index}
                />
              ))}
            </motion.div>
          )}

          {/* No Results */}
          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar os seus filtros ou termos de pesquisa
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Limpar Filtros
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}