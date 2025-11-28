'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Ticket,
  ArrowRight,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Interface baseada na API real
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

interface Event {
  id: string;
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
  categoryName: string;
  eventType: string;
}

export default function RecentEvents() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Array<{ key: string; label: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  useEffect(() => {
    const fetchRecentEvents = async () => {
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
          const transformedEvents: Event[] = eventsData.events
            .sort((a: ApiEvent, b: ApiEvent) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 6) // 🔥 PEGAR APENAS OS ÚLTIMOS 6 EVENTOS
            .map((apiEvent: ApiEvent, index: number) => {
              const categoryId = apiEvent.category?.id || apiEvent.categoryId || 'uncategorized';
              const categoryName = apiEvent.category?.name || 'Sem Categoria';
              
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
                id: apiEvent.id,
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
                attendees: parseInt(apiEvent.capacity) || Math.floor(Math.random() * 2000) + 100,
                featured: Math.random() > 0.7,
                organizer: 'Organizador',
                category: categoryId,
                categoryName: categoryName,
                eventType: eventType
              };
            });

          setEvents(transformedEvents);

          // 🔥 CRIAR CATEGORIAS ÚNICAS DOS EVENTOS CARREGADOS
          const uniqueCategories = new Map<string, { key: string; label: string; count: number }>();
          
          // Adicionar categoria "Todos os Eventos"
          uniqueCategories.set('all', { 
            key: 'all', 
            label: 'Todos os Eventos', 
            count: transformedEvents.length 
          });

          // Adicionar categorias dos eventos
          transformedEvents.forEach(event => {
            if (!uniqueCategories.has(event.category)) {
              uniqueCategories.set(event.category, {
                key: event.category,
                label: event.categoryName,
                count: transformedEvents.filter(e => e.category === event.category).length
              });
            }
          });

          const categoriesArray = Array.from(uniqueCategories.values());
          setCategories(categoriesArray);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(event => event.category === activeFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">A carregar eventos recentes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Erro ao carregar eventos
          </h3>
          <p className="text-muted-foreground mb-6">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Eventos <span className="text-secondary">Recentes</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descobre os eventos mais recentes e garante já o teu lugar nas próximas experiências memoráveis
          </p>
        </motion.div>

        {/* Filters - apenas se houver categorias */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveFilter(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === category.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category.label} {category.key !== 'all' && `(${category.count})`}
              </button>
            ))}
          </motion.div>
        )}

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                
                {/* Event Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                  {/* {event.featured && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        Em Destaque
                      </span>
                    </div>
                  )} */}
                  
                  {event.ticketsLeft < 50 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Últimos {event.ticketsLeft}
                      </span>
                    </div>
                  )}
                  
                  {/* 🔥 BADGE DO TIPO DO EVENTO */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                      event.eventType === 'online' 
                        ? 'bg-[#000214] text-[#ffbf00]' 
                        : 'bg-[#000214] text-[#ffbf00]'
                    }`}>
                      <span>{event.eventType === 'online' ? '' : ''}</span>
                      {event.eventType === 'online' ? 'Online' : 'Presencial'}
                    </span>
                  </div>
                  
                  {/* Imagem do evento ou placeholder */}
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Ticket className="w-12 h-12 text-primary/30" />
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-5 flex-1 flex flex-col">
                  
                  {/* Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-primary bg-secondary/50 px-2 py-1 rounded">
                      {event.categoryName}
                    </span>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{event.rating}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)} • {event.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Capacidade: {event.attendees.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-2xl font-bold text-foreground">
                        {formatPrice(event.price)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Preço mais baixo
                      </p>
                    </div>
                    <Link href={`/eventos/comprar/${event.id}`}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors">
                        Comprar
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link href="/eventos">
            <button className="inline-flex items-center gap-2 px-8 py-4 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Ver Todos os Eventos
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}