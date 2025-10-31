'use client';

import { motion } from 'framer-motion';
import { Ticket, Calendar, Star, TrendingUp } from 'lucide-react';
import React from 'react';

interface StatsProps {
  totalTickets: number;
  upcomingEvents: number;
  totalSpent: number;
  favoriteCategory: string;
}

const Stats: React.FC<StatsProps> = ({ 
  totalTickets, 
  upcomingEvents, 
  totalSpent, 
  favoriteCategory 
}) => {
  const stats = [
    {
      icon: Ticket,
      label: 'Total de Bilhetes',
      value: totalTickets.toString(),
      description: 'Bilhetes adquiridos'
    },
    {
      icon: Calendar,
      label: 'Próximos Eventos',
      value: upcomingEvents.toString(),
      description: 'Eventos por vir'
    },
    // {
    //   icon: TrendingUp,
    //   label: 'Total Gasto',
    //   value: `${totalSpent} MZN`,
    //   description: 'Em compras de bilhetes'
    // },
    {
      icon: Star,
      label: 'Categoria Preferida',
      value: favoriteCategory,
      description: 'Tipo de evento mais frequente'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
            
            <div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-foreground">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.description}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;