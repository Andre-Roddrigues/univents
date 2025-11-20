'use client';

import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import EventCard, { Event } from './EventCard';
import EventCategory, { Category } from './EventCategory';
import EventFilter, { DateFilter } from './EventFilter';
import { useRouter } from 'next/navigation';
import { getEventCategories } from '@/lib/actions/categories-actions';

// Interface baseada na API real
interface ApiEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  province: string;
  location: string;
  img: string;
}

export default function AllEventsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // Fetch events from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch eventos
        const eventsResponse = await fetch('https://backend-eventos.unitec.academy/events');
        
        if (!eventsResponse.ok) {
          throw new Error('Erro ao carregar eventos');
        }
        
        const eventsData = await eventsResponse.json();
        
        if (eventsData.success && eventsData.events) {
          // Transform API events to match our component's Event interface
          const transformedEvents: Event[] = eventsData.events.map((apiEvent: ApiEvent, index: number) => ({
            id: parseInt(apiEvent.id.replace(/-/g, '').substring(0, 8), 16) || index + 1,
            title: apiEvent.title,
            description: apiEvent.description,
            date: apiEvent.startDate.split('T')[0],
            time: new Date(apiEvent.startDate).toLocaleTimeString('pt-MZ', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            location: `${apiEvent.location}, ${apiEvent.province}`,
            price: Math.floor(Math.random() * 1000) + 100,
            image: `https://backend-eventos.unitec.academy/${apiEvent.img}`,
            ticketsLeft: Math.floor(Math.random() * 100) + 10,
            rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
            attendees: Math.floor(Math.random() * 2000) + 100,
            featured: Math.random() > 0.7,
            organizer: 'Organizador',
            category: getCategoryFromTitle(apiEvent.title)
          }));
          
          setEvents(transformedEvents);
        }

        // Fetch categorias da API
        const categoriesResult = await getEventCategories();
        if (categoriesResult.success && categoriesResult.categories) {
          // Transformar categorias da API para o formato do componente
          const apiCategories: Category[] = categoriesResult.categories.map((cat: any) => ({
            key: cat.id, // Usar o ID real da categoria
            label: cat.name,
            count: events.filter(e => e.category === cat.id).length
          }));

          // Adicionar categoria "Todos" no início
          const allCategories: Category[] = [
            { 
              key: 'all', 
              label: 'Todos os Eventos', 
              count: events.length 
            },
            ...apiCategories
          ];

          setCategories(allCategories);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to generate category from event title
  const getCategoryFromTitle = (title: string): string => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('música') || titleLower.includes('festival') || titleLower.includes('concerto')) {
      return 'music';
    } else if (titleLower.includes('tecnologia') || titleLower.includes('digital') || titleLower.includes('tech')) {
      return 'tech';
    } else if (titleLower.includes('negócio') || titleLower.includes('business') || titleLower.includes('empreendedorismo')) {
      return 'business';
    } else if (titleLower.includes('arte') || titleLower.includes('cultura') || titleLower.includes('exposição')) {
      return 'art';
    } else if (titleLower.includes('educação') || titleLower.includes('workshop') || titleLower.includes('conferência')) {
      return 'education';
    } else if (titleLower.includes('gastronomia') || titleLower.includes('comida') || titleLower.includes('culinária')) {
      return 'food';
    } else if (titleLower.includes('desporto') || titleLower.includes('maratona') || titleLower.includes('corrida')) {
      return 'sports';
    } else if (titleLower.includes('moda') || titleLower.includes('fashion')) {
      return 'fashion';
    } else {
      return 'workshop';
    }
  };

  const dateFilters: DateFilter[] = [
    { key: 'all', label: 'Todas as Datas' },
    { key: 'today', label: 'Hoje' },
    { key: 'week', label: 'Esta Semana' },
    { key: 'month', label: 'Este Mês' },
    { key: 'upcoming', label: 'Próximos' }
  ];

  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by category - agora usando IDs reais das categorias
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
  }, [activeFilter, searchQuery, priceRange, sortBy, dateFilter, events]);

  const handleBuyTicket = (eventId: number) => {
    router.push(`/comprar/${eventId}`);
  };

  const handleResetFilters = () => {
    setActiveFilter('all');
    setSearchQuery('');
    setPriceRange([0, 2000]);
    setDateFilter('all');
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
                  onBuyTicket={handleBuyTicket}
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
                  onBuyTicket={handleBuyTicket}
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