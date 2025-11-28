'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket, 
  Star,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Shield,
  CheckCircle,
  Plus,
  Minus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ButtonCart from '@/components/navbar/ButtonCart';
import { createCart } from '@/lib/actions/cart-actions';

// Interface baseada na API real
interface ApiEvent {
  id: string;
  title: string;
  description: string;
  capacity: string;
  startDate: string;
  endDate: string;
  province: string;
  location: string;
  img: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  } | null;
  organizer: string | null;
  tickets?: Array<{
    id: string;
    name: string;
    type: string;
    availableQuantity: number;
    price: number;
    lastDayPayment: string;
    benefits: Array<{
      id: string;
      name: string;
      description: string;
      icon: string | null;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface EventPurchaseData {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  image: string;
  capacity: number;
  ticketsLeft: number;
  rating: number;
  featured: boolean;
  organizer: string;
  longDescription: string;
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    type: string;
    availableQuantity: number;
    benefits: Array<{
      id: string;
      name: string;
      description: string;
      icon: string | null;
    }>;
    lastDayPayment: string;
  }>;
}

// Interface para os itens do carrinho
interface CartItem {
  ticketId: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  benefits: Array<{
    id: string;
    name: string;
    description: string;
    icon: string | null;
  }>;
}

export default function EventPurchasePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [event, setEvent] = useState<EventPurchaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCartFeedback, setShowCartFeedback] = useState(false);
  
  // Estado para gerenciar quantidades de cada bilhete
  const [ticketQuantities, setTicketQuantities] = useState<{[key: string]: number}>({});

  // Fetch event data from API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching event with ID:', params.id);
        
        const response = await fetch(`https://backend-eventos.unitec.academy/events/${params.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Full API Response:', data);
        
        if (data.success && data.event) {
          const apiEvent: ApiEvent = data.event;
          console.log('🎫 Complete event data:', apiEvent);
          
          const tickets = apiEvent.tickets && Array.isArray(apiEvent.tickets) ? apiEvent.tickets : [];
          
          console.log('✅ Processed tickets:', tickets);
          console.log('✅ Tickets length:', tickets.length);
          
          if (tickets.length > 0) {
            tickets.forEach((ticket, index) => {
              console.log(`🎟️ Ticket ${index + 1}:`, {
                name: ticket.name,
                price: ticket.price,
                type: ticket.type,
                availableQuantity: ticket.availableQuantity,
                benefits: ticket.benefits,
                benefitsLength: ticket.benefits?.length
              });
            });
          } else {
            console.log('❌ No tickets found or tickets is not an array');
            console.log('🛠️ Creating default tickets...');
          }
          
          const transformedEvent: EventPurchaseData = {
            id: apiEvent.id,
            title: apiEvent.title,
            description: apiEvent.description,
            category: apiEvent.category?.id || apiEvent.categoryId,
            categoryName: apiEvent.category?.name || 'Sem Categoria',
            date: apiEvent.startDate.split('T')[0],
            startTime: new Date(apiEvent.startDate).toLocaleTimeString('pt-MZ', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            endTime: new Date(apiEvent.endDate).toLocaleTimeString('pt-MZ', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            location: apiEvent.location,
            address: `${apiEvent.location}, ${apiEvent.province}`,
            image: apiEvent.img,
            capacity: parseInt(apiEvent.capacity) || 0,
            ticketsLeft: tickets.reduce((total, ticket) => total + ticket.availableQuantity, 0),
            rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
            featured: Math.random() > 0.7,
            organizer: apiEvent.organizer || 'Organizador',
            longDescription: apiEvent.description,
            ticketTypes: tickets.map(ticket => ({
              id: ticket.id,
              name: ticket.name,
              price: ticket.price,
              type: ticket.type,
              availableQuantity: ticket.availableQuantity,
              benefits: ticket.benefits || [],
              lastDayPayment: ticket.lastDayPayment
            }))
          };

          if (transformedEvent.ticketTypes.length === 0) {
            console.log('🛠️ Creating default ticket types...');
            transformedEvent.ticketTypes = [
              {
                id: 'default-normal',
                name: 'Bilhete Normal',
                price: 500,
                type: 'normal',
                availableQuantity: 50,
                benefits: [
                  {
                    id: 'default-access',
                    name: 'Acesso ao Evento',
                    description: 'Acesso à área geral do evento',
                    icon: null
                  }
                ],
                lastDayPayment: apiEvent.startDate
              },
              {
                id: 'default-vip',
                name: 'Bilhete VIP',
                price: 1000,
                type: 'vip',
                availableQuantity: 20,
                benefits: [
                  {
                    id: 'vip-access',
                    name: 'Acesso VIP',
                    description: 'Acesso à área VIP',
                    icon: null
                  },
                  {
                    id: 'vip-drink',
                    name: 'Bebida Grátis',
                    description: 'Uma bebida incluída',
                    icon: null
                  }
                ],
                lastDayPayment: apiEvent.startDate
              }
            ];
            transformedEvent.ticketsLeft = 70;
          }

          console.log('✨ Final transformed event:', transformedEvent);
          console.log('🎯 Final ticketTypes:', transformedEvent.ticketTypes);
          
          setEvent(transformedEvent);
          
          // Inicializar quantidades como 0 para todos os bilhetes
          const initialQuantities: {[key: string]: number} = {};
          transformedEvent.ticketTypes.forEach(ticket => {
            initialQuantities[ticket.id] = 0;
          });
          setTicketQuantities(initialQuantities);
          
        } else {
          console.log('❌ API response not successful:', data);
          throw new Error('Dados do evento não disponíveis');
        }
      } catch (err) {
        console.error('💥 Error fetching event:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar evento');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEventData();
    }
  }, [params.id]);

  // Funções para gerenciar quantidades
  const increaseQuantity = (ticketId: string) => {
    if (!event) return;
    
    const ticket = event.ticketTypes.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const currentQuantity = ticketQuantities[ticketId] || 0;
    const maxQuantity = Math.min(ticket.availableQuantity, 10);
    
    if (currentQuantity < maxQuantity) {
      setTicketQuantities(prev => ({
        ...prev,
        [ticketId]: currentQuantity + 1
      }));
    }
  };

  const decreaseQuantity = (ticketId: string) => {
    const currentQuantity = ticketQuantities[ticketId] || 0;
    
    if (currentQuantity > 0) {
      setTicketQuantities(prev => ({
        ...prev,
        [ticketId]: currentQuantity - 1
      }));
    }
  };

  const setQuantity = (ticketId: string, quantity: number) => {
    if (!event) return;
    
    const ticket = event.ticketTypes.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const maxQuantity = Math.min(ticket.availableQuantity, 10);
    const newQuantity = Math.max(0, Math.min(quantity, maxQuantity));
    
    setTicketQuantities(prev => ({
      ...prev,
      [ticketId]: newQuantity
    }));
  };

  // Calcular totais
  const getCartItems = (): CartItem[] => {
    if (!event) return [];
    
    return event.ticketTypes
      .filter(ticket => (ticketQuantities[ticket.id] || 0) > 0)
      .map(ticket => ({
        ticketId: ticket.id,
        name: ticket.name,
        type: ticket.type,
        price: ticket.price,
        quantity: ticketQuantities[ticket.id] || 0,
        maxQuantity: Math.min(ticket.availableQuantity, 10),
        benefits: ticket.benefits
      }));
  };

  const cartItems = getCartItems();
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const serviceFee = subtotal * 0.00;
  const total = subtotal + serviceFee;
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 🔥 FUNÇÃO PARA OBTER COR DO TIPO DE TICKET
  const getTicketTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vip':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      case 'normal':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'premium':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const handlePurchase = async () => {
    if (!event || cartItems.length === 0) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Aqui você precisará adaptar para lidar com múltiplos tipos de bilhetes
      router.push(`/compra-confirmada?event=${event.id}&total=${total}`);
    } catch (err) {
      console.error('Erro no processamento:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = () => {
    setShowCartFeedback(true);
    setTimeout(() => setShowCartFeedback(false), 3000);
  };

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, description: 'Pagamento rápido via M-Pesa' },
    { id: 'emola', name: 'eMola', icon: CreditCard, description: 'Cartão ou transferência' },
    { id: 'card', name: 'Cartão de Crédito', icon: CreditCard, description: 'Visa, Mastercard' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">A carregar evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {error || 'Evento não encontrado'}
          </h3>
          <p className="text-muted-foreground mb-6">
            O evento que procura não está disponível.
          </p>
          <Link
            href="/eventos"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Voltar aos Eventos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/eventos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos eventos
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda - Informações do Evento */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              
              {/* Cabeçalho do Evento */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {event.categoryName}
                  </span>
                  {event.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      Em Destaque
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {event.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{event.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Capacidade: {event.capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ticket className="w-4 h-4" />
                    <span>{event.ticketsLeft} bilhetes restantes</span>
                  </div>
                </div>
              </div>

              {/* Detalhes do Evento */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Detalhes do Evento</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">
                          {new Date(event.date).toLocaleDateString('pt-MZ', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">{event.location}</div>
                        <div className="text-sm text-muted-foreground">{event.address}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">Organizador</div>
                        <div className="text-sm text-muted-foreground">{event.organizer}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">Pagamento Seguro</div>
                        <div className="text-sm text-muted-foreground">Transações 100% protegidas</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Descrição Longa */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-3">Sobre este evento</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.longDescription}
                  </p>
                </div>
              </div>

              {/* Seleção de Bilhetes */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Selecionar Bilhetes</h2>
                
                {event.ticketTypes.length === 0 ? (
                  <div className="text-center py-8">
                    <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Não há bilhetes disponíveis para este evento.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {event.ticketTypes.map((ticket) => {
                      const typeColors = getTicketTypeColor(ticket.type);
                      const quantity = ticketQuantities[ticket.id] || 0;
                      const maxQuantity = Math.min(ticket.availableQuantity, 10);
                      
                      return (
                        <div
                          key={ticket.id}
                          className={`border-2 rounded-lg p-6 transition-all ${
                            quantity > 0
                              ? 'border-primary bg-primary/5'
                              : `border-border hover:border-primary/50 ${typeColors.border}`
                          } ${ticket.availableQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="font-semibold text-foreground text-lg">{ticket.name}</h3>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${typeColors.bg} ${typeColors.text}`}>
                                  {ticket.type.toUpperCase()}
                                </span>
                                {quantity > 0 && (
                                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                    {quantity} selecionado{quantity > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                              
                              {/* 🔥 PREÇO DESTACADO */}
                              <div className="text-3xl font-bold text-foreground mb-4">
                                {ticket.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                              </div>
                              
                              <div className="text-sm text-muted-foreground mb-4">
                                <span className={`font-medium ${ticket.availableQuantity < 10 ? 'text-orange-500' : 'text-green-500'}`}>
                                  {ticket.availableQuantity} bilhetes disponíveis
                                </span>
                                <span className="text-xs ml-2">(máx. {maxQuantity} por compra)</span>
                              </div>
                              
                              {/* 🔥 BENEFÍCIOS - APENAS CHECKCIRCLE */}
                              {ticket.benefits.length > 0 ? (
                                <div className="mb-4">
                                  <h4 className="font-medium text-foreground mb-2">Benefícios incluídos:</h4>
                                  <ul className="space-y-2">
                                    {ticket.benefits.map((benefit, index) => (
                                      <li key={benefit.id || index} className="flex items-center gap-3 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <div>
                                          <span className="font-medium text-foreground">{benefit.name}</span>
                                          {benefit.description && benefit.description !== benefit.name && (
                                            <p className="text-muted-foreground text-xs">{benefit.description}</p>
                                          )}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div className="mb-4">
                                  <h4 className="font-medium text-foreground mb-2">Benefícios:</h4>
                                  <p className="text-sm text-muted-foreground">Acesso básico ao evento</p>
                                </div>
                              )}
                              
                              {/* 🔥 CONTROLE DE QUANTIDADE PARA CADA BILHETE */}
                              <div className="mt-6 pt-4 border-t border-border">
                                <label className="block text-sm font-medium text-foreground mb-3">
                                  Quantidade
                                </label>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center border border-border rounded-lg">
                                    <button
                                      onClick={() => decreaseQuantity(ticket.id)}
                                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                      disabled={quantity <= 0}
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <input
                                      type="number"
                                      min="0"
                                      max={maxQuantity}
                                      value={quantity}
                                      onChange={(e) => setQuantity(ticket.id, parseInt(e.target.value) || 0)}
                                      className="px-4 py-2 font-medium text-foreground w-16 text-center border-0 bg-transparent focus:outline-none"
                                    />
                                    <button
                                      onClick={() => increaseQuantity(ticket.id)}
                                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                      disabled={quantity >= maxQuantity}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                      Subtotal: {(ticket.price * quantity).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
                                <strong>Último dia para pagamento:</strong>{' '}
                                {new Date(ticket.lastDayPayment).toLocaleDateString('pt-MZ', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Coluna Direita - Resumo e Pagamento */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-8 space-y-6"
            >
              
              {/* Resumo do Pedido */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Resumo do Pedido {totalItems > 0 && `(${totalItems} item${totalItems > 1 ? 's' : ''})`}
                </h2>
                
                {cartItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Nenhum bilhete selecionado</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.ticketId} className="flex justify-between items-start text-sm pb-2 border-b border-border/50">
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{item.name}</div>
                            <div className="text-muted-foreground">
                              {item.quantity} × {item.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                            </div>
                          </div>
                          <div className="text-foreground font-medium text-right">
                            {(item.price * item.quantity).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center text-lg font-bold text-foreground">
                        <span>Total</span>
                        <span>{total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Método de Pagamento - Só mostra se houver itens no carrinho */}
              {cartItems.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Método de Pagamento</h2>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <div className="flex items-center gap-3">
                          <method.icon className="w-5 h-5 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{method.name}</div>
                            <div className="text-sm text-muted-foreground">{method.description}</div>
                          </div>
                          {selectedPayment === method.id && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="space-y-4">
                {/* Botão de Compra Imediata */}
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </>
                  ) : cartItems.length === 0 ? (
                    'Selecione bilhetes'
                  ) : (
                    `Comprar ${totalItems} Bilhete${totalItems > 1 ? 's' : ''} - ${total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}`
                  )}
                </button>

                {/* Botão Adicionar ao Carrinho */}
                {event && cartItems.length > 0 && (
                  <ButtonCart
                    event={event}
                    cartItems={cartItems}
                    onAddToCart={handleAddToCart}
                  />
                )}

                {/* Feedback de adição ao carrinho */}
                <AnimatePresence>
                  {showCartFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 text-center"
                    >
                      ✅ Adicionado ao carrinho! ({totalItems} bilhete{totalItems > 1 ? 's' : ''})
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Garantias */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  Pagamento 100% seguro e encriptado
                </div>
                <div className="text-xs text-muted-foreground">
                  Transação processada com segurança
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}