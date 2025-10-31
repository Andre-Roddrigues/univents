'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock data - substitua pela sua API
const eventData = {
  id: 1,
  title: 'Festival de Música Moçambique 2024',
  category: 'music',
  date: '2024-02-15',
  time: '20:00',
  endTime: '23:00',
  location: 'Maputo, Praça da Independência',
  address: 'Praça da Independência, Maputo Cidade',
  price: 500,
  image: '/images/event-music.jpg',
  ticketsLeft: 23,
  rating: 4.8,
  attendees: 1500,
  featured: true,
  organizer: 'Produtora Nacional',
  description: 'O maior festival de música do país com artistas nacionais e internacionais. Uma noite inesquecível com os melhores talentos da música moçambicana.',
  longDescription: 'Junte-se a nós para uma noite épica de música e celebração. O Festival de Música Moçambique 2024 traz os artistas mais populares do país em um evento único na histórica Praça da Independência. Com produção de primeira linha, iluminação espetacular e som de qualidade superior, esta é uma experiência que ficará na memória.',
  ticketTypes: [
    { id: 'normal', name: 'Bilhete Normal', price: 500, benefits: ['Acesso à área geral', 'Uma bebida incluída'] },
    { id: 'vip', name: 'Bilhete VIP', price: 1000, benefits: ['Acesso área VIP', 'Open bar', 'Estacionamento gratuito', 'Meet & greet com artistas'] },
    { id: 'student', name: 'Bilhete Estudante', price: 300, benefits: ['Acesso à área geral', 'Desconto estudante'], requirements: 'Cartão de estudante obrigatório' }
  ],
  organizerInfo: {
    name: 'Produtora Nacional',
    rating: 4.9,
    eventsCount: 47,
    contact: 'info@produtoranacional.co.mz'
  }
};

export default function EventPurchasePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedTicketType, setSelectedTicketType] = useState('normal');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);

  const event = eventData; // Em produção, busque pelo ID dos params

  const selectedTicket = event.ticketTypes.find(ticket => ticket.id === selectedTicketType);
  const subtotal = selectedTicket ? selectedTicket.price * ticketQuantity : 0;
  const serviceFee = subtotal * 0.05; // 5% taxa de serviço
  const total = subtotal + serviceFee;

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    // Redirecionar para confirmação
    router.push(`/compra-confirmada?event=${event.id}&tickets=${ticketQuantity}`);
  };

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, description: 'Pagamento rápido via M-Pesa' },
    { id: 'emola', name: 'eMola', icon: CreditCard, description: 'Cartão ou transferência' },
    { id: 'card', name: 'Cartão de Crédito', icon: CreditCard, description: 'Visa, Mastercard' },
    { id: 'paypal', name: 'PayPal', icon: CreditCard, description: 'Pagamento internacional' }
  ];

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
                    {event.category}
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
                    <span>{event.attendees.toLocaleString()} participantes</span>
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
                          {event.time} - {event.endTime}
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
                
                <div className="space-y-4">
                  {event.ticketTypes.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTicketType === ticket.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedTicketType(ticket.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{ticket.name}</h3>
                            {selectedTicketType === ticket.id && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          
                          <div className="text-2xl font-bold text-foreground mb-3">
                            {ticket.price} MZN
                          </div>
                          
                          <ul className="space-y-1">
                            {ticket.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                          
                          {ticket.requirements && (
                            <p className="text-xs text-orange-600 mt-2">
                              * {ticket.requirements}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Quantidade */}
                <div className="mt-6 pt-6 border-t border-border">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Quantidade
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={ticketQuantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-medium text-foreground min-w-12 text-center">
                        {ticketQuantity}
                      </span>
                      <button
                        onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                        className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={ticketQuantity >= 10}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Máximo 10 bilhetes por compra
                    </span>
                  </div>
                </div>
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
                <h2 className="text-xl font-semibold text-foreground mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {selectedTicket?.name} × {ticketQuantity}
                    </span>
                    <span className="text-foreground">{subtotal} MZN</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de serviço</span>
                    <span className="text-foreground">{serviceFee.toFixed(2)} MZN</span>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>{total.toFixed(2)} MZN</span>
                  </div>
                </div>
              </div>

              {/* Método de Pagamento */}
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

              {/* Botão de Compra */}
              <button
                onClick={handlePurchase}
                disabled={isProcessing || event.ticketsLeft === 0}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  `Comprar ${ticketQuantity} Bilhete${ticketQuantity > 1 ? 's' : ''} - ${total.toFixed(2)} MZN`
                )}
              </button>

              {/* Garantias */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  Pagamento 100% seguro e encriptado
                </div>
                <div className="text-xs text-muted-foreground">
                  Reembolso garantido em caso de cancelamento
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}