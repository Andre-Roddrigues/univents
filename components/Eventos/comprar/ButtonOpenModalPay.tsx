'use client';

import { useState } from 'react';
import { CreditCard, ShoppingBag, Ticket } from 'lucide-react';
import ModalPay from '../ModalPay';


interface ButtonOpenModalPayProps {
  event: {
    id: string;
    title: string;
  };
  tickets: Array<{
    id: string;
    name: string;
    price: number;
    type: string;
    quantity: number;
  }>;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function ButtonOpenModalPay({
  event,
  tickets,
  disabled = false,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = ''
}: ButtonOpenModalPayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calcular totais
  const totalAmount = tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  const totalItems = tickets.reduce((total, ticket) => total + ticket.quantity, 0);

  // Verificar se há tickets selecionados
  const hasSelectedTickets = tickets.some(ticket => ticket.quantity > 0);

  // Obter classes baseadas nas props
  const getButtonClasses = () => {
    const baseClasses = 'flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
    
    // Classes de tamanho
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5',
      lg: 'px-6 py-3 text-lg'
    };

    // Classes de variante
    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border-2 border-primary text-primary hover:bg-primary/10',
      ghost: 'text-primary hover:bg-primary/10'
    };

    const widthClass = fullWidth ? 'w-full' : '';
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    });
  };

  // Texto do botão baseado no total
  const getButtonText = () => {
    if (totalItems === 0) return 'Selecionar Bilhetes';
    
    if (variant === 'ghost') {
      return `Pagar ${formatCurrency(totalAmount)}`;
    }
    
    return `Comprar ${totalItems} ${totalItems === 1 ? 'bilhete' : 'bilhetes'} • ${formatCurrency(totalAmount)}`;
  };

  // Ícone do botão
  const getButtonIcon = () => {
    if (totalItems === 0) return <Ticket className="w-4 h-4" />;
    if (variant === 'ghost') return <CreditCard className="w-4 h-4" />;
    return <ShoppingBag className="w-4 h-4" />;
  };

  // Tooltip quando não há tickets selecionados
  const getTooltipText = () => {
    if (!hasSelectedTickets) {
      return 'Selecione pelo menos um bilhete antes de comprar';
    }
    return '';
  };

  return (
    <>
      <div className="relative group" title={getTooltipText()}>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={disabled || !hasSelectedTickets}
          className={getButtonClasses()}
        >
          {getButtonIcon()}
          <span>{getButtonText()}</span>
        </button>
        
        {/* Badge com quantidade de itens */}
        {/* {totalItems > 0 && variant !== 'ghost' && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {totalItems}
          </span>
        )} */}
        
        {/* Tooltip para quando não há tickets */}
        {!hasSelectedTickets && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Selecione bilhetes primeiro
          </div>
        )}
      </div>

<div className="mt-12">
      <ModalPay
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
        tickets={tickets.filter(t => t.quantity > 0)}
      />
    </div>
    </>
  );
}