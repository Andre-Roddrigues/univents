'use client';

import { useState } from 'react';
import { Mentor, AvailableSlot } from '@/types/mentorship';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';

interface DateTimeSelectorProps {
  mentor: Mentor;
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
}

export function DateTimeSelector({ 
  mentor, 
  selectedDate, 
  selectedTime, 
  onDateSelect, 
  onTimeSelect 
}: DateTimeSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Gerar próximos 30 dias disponíveis
  const availableDates = generateAvailableDates(mentor.availableSlots);
  
  // Agrupar slots por data
  const slotsByDate = mentor.availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, AvailableSlot[]>);

  const availableTimeSlots = selectedDate ? slotsByDate[selectedDate] || [] : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
      {/* Informações do Mentor */}
      <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
        <div className="relative h-16 w-16">
          <Image
            src={mentor.image}
            alt={mentor.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{mentor.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{mentor.title}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {mentor.location}
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-bold text-green-600">
            MT {mentor.price.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">por hora</div>
        </div>
      </div>

      {/* Seleção de Data */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Selecionar Data
        </h4>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {availableDates.map((date) => {
            const dateObj = new Date(date);
            const day = dateObj.getDate();
            const isSelected = selectedDate === date;
            const hasSlots = slotsByDate[date]?.length > 0;

            return (
              <Button
                key={date}
                variant={isSelected ? "default" : "outline"}
                disabled={!hasSlots}
                onClick={() => onDateSelect(date)}
                className={`h-12 p-0 ${
                  !hasSlots ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm">{day}</span>
                  {hasSlots && (
                    <span className="w-1 h-1 bg-green-500 rounded-full mt-1"></span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Seleção de Horário */}
      {selectedDate && (
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Horários Disponíveis - {new Date(selectedDate).toLocaleDateString('pt-BR')}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableTimeSlots
              .filter(slot => slot.isAvailable)
              .map((slot) => (
                <Button
                  key={`${slot.startTime}-${slot.endTime}`}
                  variant={selectedTime === slot.startTime ? "default" : "outline"}
                  onClick={() => onTimeSelect(slot.startTime)}
                  className="h-12"
                >
                  {slot.startTime} - {slot.endTime}
                </Button>
              ))}
          </div>
          {availableTimeSlots.filter(slot => slot.isAvailable).length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nenhum horário disponível para esta data
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Função auxiliar para gerar datas disponíveis
function generateAvailableDates(availableSlots: AvailableSlot[]): string[] {
  const dates = new Set(availableSlots.map(slot => slot.date));
  return Array.from(dates).sort();
}