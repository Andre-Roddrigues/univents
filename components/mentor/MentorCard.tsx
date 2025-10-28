// components/mentor/MentorCard.tsx
import { Mentor } from '@/types/mentorship';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, Languages, Grid3X3, List } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface MentorCardProps {
  mentor: Mentor;
  viewMode?: 'grid' | 'list';
}

export function MentorCard({ mentor, viewMode = 'grid' }: MentorCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Imagem para vista de lista */}
          <div className="md:w-48 p-6 flex justify-center md:justify-start">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <Image
                src={mentor.image}
                alt={`Foto de ${mentor.name}`}
                fill
                className="object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
              />
            </div>
          </div>

          {/* Conteúdo para vista de lista */}
          <div className="flex-1 p-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                {/* Nome e Titulação */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {mentor.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {mentor.title} • {mentor.company}
                  </p>
                </div>

                {/* Rating e Experiência */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">{mentor.rating.toFixed(1)}</span>
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mentor.experience} anos de experiência
                  </span>
                </div>

                {/* Localização e Idiomas */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{mentor.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Languages className="w-4 h-4 mr-1" />
                    <span>{mentor.languages.join(', ')}</span>
                  </div>
                </div>

                {/* Descrição (apenas na lista) */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {mentor.description}
                </p>

                {/* Categorias */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.categories.slice(0, 4).map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {mentor.categories.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{mentor.categories.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Preço e Ação para lista */}
              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="text-right">
                  <span className="text-2xl font-bold text-secondary">
                    MT {mentor.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    /hora
                  </span>
                </div>
                <Link href={`/mentores/${mentor.id}`}>
                  <Button className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                    Ver Perfil
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de Grid (original)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header com imagem circular */}
      <div className="relative pt-8 px-6">
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <Image
              src={mentor.image}
              alt={`Foto de ${mentor.name}`}
              fill
              className="object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-6 pt-4">
        {/* Nome e Titulação */}
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {mentor.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            {mentor.title} • {mentor.company}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{mentor.rating.toFixed(1)}</span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {mentor.experience} anos
          </span>
        </div>

        {/* Localização */}
        <div className="flex items-center justify-center mb-3 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{mentor.location}</span>
        </div>

        {/* Idiomas */}
        <div className="flex items-center justify-center mb-4 text-sm text-gray-600 dark:text-gray-400">
          <Languages className="w-4 h-4 mr-1" />
          <span>{mentor.languages.join(', ')}</span>
        </div>

        {/* Categorias */}
        <div className="flex flex-wrap gap-1 mb-4 justify-center">
          {mentor.categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
          {mentor.categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{mentor.categories.length - 3}
            </Badge>
          )}
        </div>

        {/* Preço e Ação */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-secondary">
              MT {mentor.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              /hora
            </span>
          </div>
          <Link href={`/mentores/${mentor.id}`}>
            <Button className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              Ver Perfil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Componente de controle de vista
interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-2 rounded-md transition-all duration-200 ${
          viewMode === 'grid'
            ? 'bg-primary text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded-md transition-all duration-200 ${
          viewMode === 'list'
            ? 'bg-primary text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}