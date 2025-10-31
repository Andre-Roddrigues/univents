'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Ticket, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export interface Event {
  id: number;
  title: string;
  category: string;
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
  description: string;
}

interface EventCardProps {
  event: Event;
  viewMode: 'grid' | 'list';
  categories: Array<{ key: string; label: string }>;
  index?: number;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  viewMode, 
  categories, 
  index = 0 
}) => {
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

  // Componente do Botão de Compra com Link
  const BuyButton = () => (
    <Link href={`/eventos/comprar/${event.id}`}>
      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
        Comprar
        <ArrowRight className="w-4 h-4" />
      </button>
    </Link>
  );

  // Componente do Botão de Compra para List View
  const BuyButtonList = () => (
    <Link href={`/eventos/${event.id}`}>
      <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-full md:w-auto justify-center">
        Comprar Bilhete
        <ArrowRight className="w-4 h-4" />
      </button>
    </Link>
  );

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group"
      >
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          
          {/* Event Image com Link */}
          <Link href={`/eventos/${event.id}`} className="block relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
            {event.featured && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Em Destaque
                </span>
              </div>
            )}
            
            {event.ticketsLeft < 50 && (
              <div className="absolute top-3 right-3 z-10">
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                  Últimos {event.ticketsLeft}
                </span>
              </div>
            )}
            
            {/* Placeholder for image */}
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <Ticket className="w-12 h-12 text-primary/30" />
            </div>
          </Link>

          {/* Event Content */}
          <div className="p-5 flex-1 flex flex-col">
            
            {/* Category */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                {categories.find(cat => cat.key === event.category)?.label}
              </span>
              
              {/* Rating */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{event.rating}</span>
              </div>
            </div>

            {/* Title com Link */}
            <Link href={`/eventos/${event.id}`}>
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                {event.title}
              </h3>
            </Link>

            {/* Organizer */}
            <p className="text-sm text-muted-foreground mb-3">
              Por {event.organizer}
            </p>

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

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {event.description}
            </p>

            {/* Price and CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(event.price)}
                </span>
              </div>
              
              <BuyButton />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // List View
  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          
          {/* Event Image com Link */}
          <Link href={`/eventos/${event.id}`} className="block relative md:w-64 h-48 md:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
            {event.featured && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Em Destaque
                </span>
              </div>
            )}
            
            {/* Placeholder for image */}
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <Ticket className="w-12 h-12 text-primary/30" />
            </div>
          </Link>

          {/* Event Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {categories.find(cat => cat.key === event.category)?.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{event.rating}</span>
                    </div>
                  </div>
                  
                  {/* Title com Link */}
                  <Link href={`/eventos/${event.id}`}>
                    <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors cursor-pointer">
                      {event.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    Por {event.organizer}
                  </p>
                </div>
                
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground">
                    {formatPrice(event.price)}
                  </span>
                  {event.ticketsLeft < 50 && (
                    <div className="text-xs text-red-500 font-medium mt-1">
                      Últimos {event.ticketsLeft} bilhetes
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {event.description}
              </p>

              {/* Details and CTA */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto pt-4 border-t border-border">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 md:mb-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)} • {event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees.toLocaleString()} participantes</span>
                  </div>
                </div>
                
                <BuyButtonList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;