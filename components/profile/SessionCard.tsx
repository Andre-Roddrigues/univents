// components/profile/SessionCard.tsx
'use client';

import { useState } from 'react';
import { Booking } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Video, Star, MoreVertical, Send } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

interface SessionCardProps {
  booking: Booking;
  onReschedule: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  onRate: (booking: Booking, rating: number, review?: string) => void;
}

export function SessionCard({ booking, onReschedule, onCancel, onRate }: SessionCardProps) {
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState(booking.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState(booking.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUpcoming = booking.status === 'confirmed' || booking.status === 'pending';
  const isCompleted = booking.status === 'completed';
  const isCancelled = booking.status === 'cancelled';
  const hasRated = Boolean(booking.rating);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoverRating(starRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      alert('Por favor, selecione uma avaliação com estrelas');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRate(booking, rating, review);
      setIsRating(false);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartRating = () => {
    setIsRating(true);
    setRating(booking.rating || 0);
    setReview(booking.review || '');
  };

  const handleCancelRating = () => {
    setIsRating(false);
    setRating(booking.rating || 0);
    setReview(booking.review || '');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative h-16 w-16">
            <Image
              src={booking.mentorAvatar}
              alt={booking.mentorName}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{booking.mentorName}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {booking.mentorTitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusVariant(booking.status)}>
            {getStatusText(booking.status)}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isUpcoming && (
                <>
                  <DropdownMenuItem onClick={() => onReschedule(booking)}>
                    Reagendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCancel(booking)}>
                    Cancelar
                  </DropdownMenuItem>
                </>
              )}
              {isCompleted && !hasRated && (
                <DropdownMenuItem onClick={handleStartRating}>
                  Avaliar Sessão
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                Ver Detalhes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(booking.date)}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          {booking.startTime} - {booking.endTime} ({booking.duration}min)
        </div>
        
        <div className="flex items-center text-sm font-semibold text-secondary">
          MT {booking.price.toFixed(2)}
        </div>
      </div>

      {booking.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Notas:</strong> {booking.notes}
          </p>
        </div>
      )}

      {/* Sistema de Rating */}
      {isCompleted && (
        <div className="border-t pt-4 mt-4">
          {!isRating && hasRated && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {rating}.0
                </span>
              </div>
              {booking.review && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 ml-4">
                  "{booking.review}"
                </p>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartRating}
                className="text-blue-600 hover:text-blue-700"
              >
                Editar Avaliação
              </Button>
            </div>
          )}

          {!isRating && !hasRated && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Como foi sua experiência com {booking.mentorName}?
              </p>
              <Button
                onClick={handleStartRating}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 mx-auto"
              >
                <Star className="w-4 h-4" />
                Avaliar Sessão
              </Button>
            </div>
          )}

          {isRating && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avalie a sessão
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {rating}.0
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comentário (opcional)
                </label>
                <Textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Compartilhe sua experiência com esta sessão..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancelRating}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitRating}
                  disabled={isSubmitting || rating === 0}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Avaliação
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {isUpcoming && booking.meetingLink && (
        <div className="flex space-x-2">
          <Button size="sm" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Entrar na Chamada
          </Button>
          <Button variant="outline" size="sm">
            Adicionar ao Calendário
          </Button>
        </div>
      )}
    </div>
  );
}