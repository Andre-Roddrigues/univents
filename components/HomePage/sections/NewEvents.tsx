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
import { useState } from 'react';

export default function RecentEvents() {
  const [activeFilter, setActiveFilter] = useState('all');

  const events = [
    {
      id: 1,
      title: 'Festival de Música Moçambique',
      category: 'music',
      date: '2024-02-15',
      time: '20:00',
      location: 'Maputo, Praça da Independência',
      price: 500,
      image: '/images/event-music.jpg',
      ticketsLeft: 23,
      rating: 4.8,
      attendees: 1500,
      featured: true
    },
    {
      id: 2,
      title: 'Workshop de Tecnologia & Inovação',
      category: 'tech',
      date: '2024-02-18',
      time: '09:00',
      location: 'Universidade Eduardo Mondlane',
      price: 250,
      image: '/images/event-tech.jpg',
      ticketsLeft: 45,
      rating: 4.6,
      attendees: 200,
      featured: false
    },
    {
      id: 3,
      title: 'Feira de Negócios 2024',
      category: 'business',
      date: '2024-02-20',
      time: '10:00',
      location: 'Centro de Conferências Joaquim Chissano',
      price: 750,
      image: '/images/event-business.jpg',
      ticketsLeft: 12,
      rating: 4.9,
      attendees: 800,
      featured: true
    },
    {
      id: 4,
      title: 'Exposição de Arte Contemporânea',
      category: 'art',
      date: '2024-02-22',
      time: '14:00',
      location: 'Museu de Arte de Maputo',
      price: 150,
      image: '/images/event-art.jpg',
      ticketsLeft: 67,
      rating: 4.7,
      attendees: 300,
      featured: false
    },
    {
      id: 5,
      title: 'Conferência de Educação Digital',
      category: 'education',
      date: '2024-02-25',
      time: '08:30',
      location: 'Instituto Superior de Ciências e Tecnologia',
      price: 300,
      image: '/images/event-education.jpg',
      ticketsLeft: 89,
      rating: 4.5,
      attendees: 150,
      featured: false
    },
    {
      id: 6,
      title: 'Festival Gastronómico',
      category: 'food',
      date: '2024-02-28',
      time: '12:00',
      location: 'Feira Popular de Maputo',
      price: 200,
      image: '/images/event-food.jpg',
      ticketsLeft: 34,
      rating: 4.8,
      attendees: 500,
      featured: true
    }
  ];

  const categories = [
    { key: 'all', label: 'Todos os Eventos' },
    { key: 'music', label: 'Música' },
    { key: 'tech', label: 'Tecnologia' },
    { key: 'business', label: 'Negócios' },
    { key: 'art', label: 'Arte & Cultura' },
    { key: 'education', label: 'Educação' },
    { key: 'food', label: 'Gastronomia' }
  ];

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
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Eventos em Destaque
          </div> */}
          
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Eventos <span className="text-secondary">Recentes</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descobre os eventos recentes e garante já o teu lugar nas próximas experiências memoráveis
          </p>
        </motion.div>

        {/* Filters */}
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
              {category.label}
            </button>
          ))}
        </motion.div>

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
                  
                  {/* {event.ticketsLeft < 50 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Últimos {event.ticketsLeft}
                      </span>
                    </div>
                  )}
                   */}
                  {/* Placeholder for image */}
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Ticket className="w-12 h-12 text-primary/30" />
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-5 flex-1 flex flex-col">
                  
                  {/* Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-primary bg-secondary/50 px-2 py-1 rounded">
                      {categories.find(cat => cat.key === event.category)?.label}
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
                      <span>{event.attendees.toLocaleString()} participantes</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-2xl font-bold text-foreground">
                        {formatPrice(event.price)}
                      </span>
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