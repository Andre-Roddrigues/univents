'use client';

import { motion } from 'framer-motion';
import { Filter, Search, Grid, List, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

export interface DateFilter {
  key: string;
  label: string;
}

interface EventFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  dateFilter: string;
  onDateFilterChange: (filter: string) => void;
  dateFilters: DateFilter[];
  onResetFilters: () => void;
}

const EventFilter: React.FC<EventFilterProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showFilters,
  onToggleFilters,
  priceRange,
  onPriceRangeChange,
  dateFilter,
  onDateFilterChange,
  dateFilters,
  onResetFilters
}) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 🔥 Padrão: descendente (mais recentes primeiro)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(price);
  };

  // 🔥 OPÇÕES DE ORDENAÇÃO ATUALIZADAS
  const sortOptions = [
    { value: 'recent', label: 'Recentes' },
    { value: 'date', label: 'Data do Evento' },
    { value: 'price', label: 'Preço' },
    { value: 'rating', label: 'Avaliação' },
    { value: 'popular', label: 'Popularidade' },
  ];

  // 🔥 FUNÇÃO PARA LIDAR COM MUDANÇA DE ORDENAÇÃO
  const handleSortChange = (newSortBy: string) => {
    // Se estiver mudando o tipo de ordenação, mantém a ordem atual
    if (newSortBy !== sortBy) {
      onSortChange(`${newSortBy}-${sortOrder}`);
    } else {
      // Se estiver no mesmo tipo, alterna a ordem
      const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      setSortOrder(newOrder);
      onSortChange(`${newSortBy}-${newOrder}`);
    }
  };

  // 🔥 FUNÇÃO PARA ALTERNAR APENAS A ORDEM
  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    
    // Extrai o tipo de ordenação atual (sem a ordem)
    const currentSortType = sortBy.split('-')[0];
    onSortChange(`${currentSortType}-${newOrder}`);
  };

  // 🔥 EXTRAI O TIPO DE ORDENAÇÃO ATUAL (SEM A ORDEM)
  const currentSortType = sortBy.split('-')[0];

  // 🔥 GET SORT LABEL BASEADO NO TIPO E ORDEM
  const getSortLabel = () => {
    const baseLabel = sortOptions.find(opt => opt.value === currentSortType)?.label || 'Ordenar';
    
    switch (currentSortType) {
      case 'recent':
        return sortOrder === 'desc' ? 'Mais Recentes' : 'Mais Antigos';
      case 'date':
        return sortOrder === 'desc' ? 'Data Próxima' : 'Data Distante';
      case 'price':
        return sortOrder === 'desc' ? 'Preço Alto' : 'Preço Baixo';
      case 'rating':
        return sortOrder === 'desc' ? 'Melhor Avaliação' : 'Pior Avaliação';
      case 'popular':
        return sortOrder === 'desc' ? 'Mais Populares' : 'Menos Populares';
      default:
        return baseLabel;
    }
  };

  // 🔥 GET ICON BASEADO NA ORDEM
  const getSortIcon = () => {
    if (sortOrder === 'desc') {
      return <ChevronDown className="w-4 h-4" />;
    } else {
      return <ChevronUp className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8">
        
        {/* Search */}
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar eventos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          
          {/* Sort By - ATUALIZADO COM SETAS */}
          <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
            {/* Dropdown do tipo de ordenação */}
            <select
              value={currentSortType}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 bg-background focus:outline-none border-r border-border"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Botão para alternar ordem */}
            <button
              onClick={toggleSortOrder}
              className="px-3 py-2 hover:bg-muted transition-colors flex items-center"
              title={getSortLabel()}
            >
              {getSortIcon()}
            </button>
          </div>

          {/* Display do label atual */}
          <div className="hidden sm:block text-sm text-muted-foreground min-w-[120px]">
            {getSortLabel()}
          </div>

          {/* View Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-secondary text-primary' : 'bg-background'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtros
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card border border-border rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Preço: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(10000)}</span>
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Data do Evento
              </label>
              <select
                value={dateFilter}
                onChange={(e) => onDateFilterChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {dateFilters.map(filter => (
                  <option key={filter.key} value={filter.key}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={onResetFilters}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default EventFilter;