import { BookingStats } from '@/types/user';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatsCardsProps {
  stats: BookingStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      label: 'Total de Sessões',
      value: stats.total,
      icon: Calendar,
      color: 'blue',
      delay: '0'
    },
    {
      label: 'Próximas',
      value: stats.upcoming,
      icon: Clock,
      color: 'orange',
      delay: '100'
    },
    {
      label: 'Concluídas',
      value: stats.completed,
      icon: CheckCircle,
      color: 'green',
      delay: '200'
    },
    {
      label: 'Canceladas',
      value: stats.cancelled,
      icon: XCircle,
      color: 'red',
      delay: '300'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item) => (
        <div 
          key={item.label}
          className="group relative"
          style={{
            animationDelay: `${item.delay}ms`
          }}
        >
          {/* Efeito de brilho no hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
          
          {/* Card principal */}
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {item.value}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                  {item.label}
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0  rounded-full blur group-hover:blur-lg transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-white dark:bg-gray-800 p-3 rounded-full  group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 text-primary dark:text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}   