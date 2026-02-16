'use client';

import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import EventCard from './EventCard';
import EventCategory, { Category } from './EventCategory';
import EventFilter, { DateFilter } from './EventFilter';
import { useRouter } from 'next/navigation';
import { getEventCategories } from '@/lib/actions/categories-actions';
import { routes } from '@/config/routes';

// Interface baseada na API real - ATUALIZADA
interface ApiEvent {
  id: string;
  title: string;
  description: string;
  capacity: string;
  startDate: string;
  endDate: string;
  province: string;
  location: string;
  img: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  } | null;
  tickets: Array<{
    id: string;
    name: string;
    type: string;
    availableQuantity: number;
    price: number;
    lastDayPayment: string;
    benefits: Array<{
      id: string;
      name: string;
      description: string;
      icon: string | null;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Interface Event atualizada para usar id como string
interface Event {
  id: string; // ✅ MUDADO PARA STRING
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  ticketsLeft: number;
  rating: number;
  attendees: number;
  featured: boolean;
  organizer: string;
  category: string;
  createdAt: string;
  eventType: string;
}

export default function AllEventsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent-desc'); // 🔥 Padrão: mais recentes primeiro
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleEventsCount, setVisibleEventsCount] = useState(12); // 🔥 Estado para controlar quantos eventos mostrar
  
  const router = useRouter();

  // Fetch events from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch eventos
        const eventsResponse = await fetch(routes.events);
        
        if (!eventsResponse.ok) {
          throw new Error('Erro ao carregar eventos');
        }
        
        const eventsData = await eventsResponse.json();
        
        if (eventsData.success && eventsData.events) {
          // Transform API events to match our component's Event interface
          const transformedEvents: Event[] = eventsData.events.map((apiEvent: ApiEvent, index: number) => {
            const categoryId = apiEvent.category?.id || apiEvent.categoryId || 'uncategorized';
            
            // 🔥 ENCONTRAR O PREÇO MAIS BAIXO E O TIPO DO TICKET
            const minPriceTicket = apiEvent.tickets && apiEvent.tickets.length > 0 
              ? apiEvent.tickets.reduce((min, ticket) => ticket.price < min.price ? ticket : min)
              : null;

            const minPrice = minPriceTicket ? minPriceTicket.price : Math.floor(Math.random() * 1000) + 100;
            
            // 🔥 DETERMINAR O TIPO DO EVENTO (presencial/online)
            const eventType = minPriceTicket ? minPriceTicket.type : 'presencial';

            const ticketsLeft = apiEvent.tickets 
              ? apiEvent.tickets.reduce((total, ticket) => total + ticket.availableQuantity, 0)
              : Math.floor(Math.random() * 100) + 10;

            return {
              id: apiEvent.id, // ✅ CORRIGIDO: MANTER COMO STRING ORIGINAL
              title: apiEvent.title,
              description: apiEvent.description,
              date: apiEvent.startDate.split('T')[0],
              time: new Date(apiEvent.startDate).toLocaleTimeString('pt-MZ', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              location: `${apiEvent.location}, ${apiEvent.province}`,
              price: minPrice,
              image: apiEvent.img,
              ticketsLeft: ticketsLeft,
              rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
              attendees: parseInt(apiEvent.capacity) || Math.floor(Math.random() * 2000) + 100, // 🔥 USAR CAPACIDADE EM VEZ DE PARTICIPANTES
              featured: Math.random() > 0.7,
              organizer: 'Organizador',
              category: categoryId,
              createdAt: apiEvent.createdAt,
              eventType: eventType // 🔥 ADICIONAR TIPO DO EVENTO
            };
          });

          // 🔥 ORDENAR EVENTOS POR CREATEDAT (MAIS RECENTES PRIMEIRO)
          const sortedEvents = transformedEvents.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          setEvents(sortedEvents);

          // Fetch categorias da API
          const categoriesResult = await getEventCategories();
          if (categoriesResult.success && categoriesResult.categories) {
            const eventCountByCategory: { [key: string]: number } = {};
            sortedEvents.forEach(event => {
              eventCountByCategory[event.category] = (eventCountByCategory[event.category] || 0) + 1;
            });

            const apiCategories: Category[] = categoriesResult.categories.map((cat: any) => ({
              key: cat.id,
              label: cat.name,
              count: eventCountByCategory[cat.id] || 0
            }));

            const uncategorizedCount = eventCountByCategory['uncategorized'] || 0;
            const allCategories: Category[] = [
              { 
                key: 'all', 
                label: 'Todos os Eventos', 
                count: sortedEvents.length 
              },
              ...apiCategories
            ];

            if (uncategorizedCount > 0) {
              allCategories.push({
                key: 'uncategorized',
                label: 'Sem Categoria',
                count: uncategorizedCount
              });
            }

            setCategories(allCategories);
          }
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(event => 
      event.price >= priceRange[0] && event.price <= priceRange[1]
    );

    // Filter by date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === today.toDateString();
        });
        break;
      case 'week':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate <= weekEnd;
        });
        break;
      case 'month':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate <= monthEnd;
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today;
        });
        break;
    }

    // Sort events
    filtered.sort((a, b) => {
      const [sortType, sortOrder] = sortBy.split('-');
      const orderMultiplier = sortOrder === 'desc' ? -1 : 1;

      switch (sortType) {
        case 'recent':
          return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * orderMultiplier;
        case 'date':
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * orderMultiplier;
        case 'price':
          return (a.price - b.price) * orderMultiplier;
        case 'rating':
          return (b.rating - a.rating) * orderMultiplier;
        case 'popular':
          return (b.attendees - a.attendees) * orderMultiplier;
        default:
          return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * orderMultiplier;
      }
    });

    return filtered;
  }, [activeFilter, searchQuery, priceRange, sortBy, dateFilter, events]);

  // 🔥 EVENTOS VISÍVEIS (apenas os primeiros X)
  const visibleEvents = useMemo(() => {
    return filteredEvents.slice(0, visibleEventsCount);
  }, [filteredEvents, visibleEventsCount]);

  // 🔥 FUNÇÃO PARA MOSTRAR MAIS EVENTOS
  const showMoreEvents = () => {
    setVisibleEventsCount(prev => prev + 12);
  };

  // 🔥 FUNÇÃO PARA RESETAR QUANDO MUDAR FILTROS
  useEffect(() => {
    setVisibleEventsCount(12);
  }, [activeFilter, searchQuery, priceRange, dateFilter, sortBy]);

  const handleResetFilters = () => {
    setActiveFilter('all');
    setSearchQuery('');
    setPriceRange([0, 2000]);
    setDateFilter('all');
    setSortBy('recent-desc');
    setVisibleEventsCount(12);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">A carregar eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Erro ao carregar eventos
          </h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-8 max-w-7xl">
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
        <div className="container mx-auto px-8 max-w-7xl">
          
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

          {/* Categories com scroll vertical */}
          <div className="mb-8">
            <EventCategory
              categories={categories}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Mostrando <span className="font-semibold text-foreground">{visibleEvents.length}</span> de{' '}
              <span className="font-semibold text-foreground">{filteredEvents.length}</span> eventos
              {activeFilter !== 'all' && ` em ${categories.find(c => c.key === activeFilter)?.label}`}
            </p>
          </div>

          {/* Events Grid/List */}
          {viewMode === 'grid' ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleEvents.map((event, index) => (
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
              {visibleEvents.map((event, index) => (
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

          {/* 🔥 BOTÃO MOSTRAR MAIS */}
          {visibleEvents.length < filteredEvents.length && (
            <div className="flex justify-center mt-8">
              <motion.button
                onClick={showMoreEvents}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Mostrar Mais ({filteredEvents.length - visibleEvents.length} eventos restantes)
              </motion.button>
            </div>
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