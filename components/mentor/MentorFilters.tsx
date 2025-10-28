// components/mentor/MentorFilters.tsx (versão alternativa)
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MentorFiltersProps {
  categories: string[];
  locations: string[];
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  category: string;
  location: string;
  priceRange: string;
  experience: string;
  sessionType: string;
}

// Valores padrão para os selects
const DEFAULT_VALUES = {
  category: 'all-categories',
  location: 'all-locations', 
  priceRange: 'all-prices',
  experience: 'all-experience',
};

export function MentorFilters({ categories, locations, onFiltersChange }: MentorFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: DEFAULT_VALUES.category,
    location: DEFAULT_VALUES.location,
    priceRange: DEFAULT_VALUES.priceRange,
    experience: DEFAULT_VALUES.experience,
    sessionType: 'all',
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: DEFAULT_VALUES.category,
      location: DEFAULT_VALUES.location,
      priceRange: DEFAULT_VALUES.priceRange,
      experience: DEFAULT_VALUES.experience,
      sessionType: 'all',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return value !== '';
    return !Object.values(DEFAULT_VALUES).includes(value) && value !== 'all';
  });

  return (
    <div className="space-y-4">
      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar mentores por nome, especialidade..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros Mobile Trigger */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
              {Object.entries(filters).filter(([key, value]) => {
                if (key === 'search') return value !== '';
                return !Object.values(DEFAULT_VALUES).includes(value) && value !== 'all';
              }).length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filtros */}
      <div className={`space-y-4 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Área de atuação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_VALUES.category}>Todas as áreas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Localização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_VALUES.location}>Todas as localizações</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Faixa de preço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_VALUES.priceRange}>Preço</SelectItem>
              <SelectItem value="0-100">Até MT 100</SelectItem>
              <SelectItem value="100-300">MT 100 - MT 300</SelectItem>
              <SelectItem value="300-500">MT 300 - MT 500</SelectItem>
              <SelectItem value="500+">Acima de MT 500</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.experience} onValueChange={(value) => handleFilterChange('experience', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Experiência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_VALUES.experience}>Experiência</SelectItem>
              <SelectItem value="0-2">0-2 anos</SelectItem>
              <SelectItem value="3-5">3-5 anos</SelectItem>
              <SelectItem value="5-10">5-10 anos</SelectItem>
              <SelectItem value="10+">10+ anos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botão Limpar Filtros */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}