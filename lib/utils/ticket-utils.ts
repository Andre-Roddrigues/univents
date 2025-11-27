// Tipos compartilhados
export interface UserTicket {
  id: string;
  amount: number;
  reference: string | null;
  method: 'mpesa' | 'tranference';
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  paymentDate: string;
  itemName: string;
  itemId: string;
  entityId: string;
  cart: {
    id: string;
    discount: number | null;
    TotalPriceAftertDiscount: number | null;
    totalPrice: number;
    status: 'pending' | 'completed' | 'cancelled';
    userId: string;
    cartItems: Array<{
      id: string;
      ticketId: string;
      cartId: string;
      price: number;
      quantity: number;
      TotalProductDiscount: number | null;
      ticket: {
        id: string;
        name: string;
        type: string;
        price: number;
        availableQuantity: number;
        lastDayPayment: string;
        status: 'active' | 'inactive';
        eventId: string;
      };
    }>;
  };
}

export interface ProcessedTicket {
  paymentId: string;
  ticketId: string;
  ticketName: string;
  ticketType: string;
  eventId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
  reference: string | null;
  cartId: string;
}

// =====================================
// UTILS: Funções utilitárias (não são Server Actions)
// =====================================

// Processar bilhetes para formato mais amigável
export function processUserTickets(payments: UserTicket[]): ProcessedTicket[] {
  const processedTickets: ProcessedTicket[] = [];

  payments.forEach(payment => {
    payment.cart.cartItems.forEach(cartItem => {
      processedTickets.push({
        paymentId: payment.id,
        ticketId: cartItem.ticket.id,
        ticketName: cartItem.ticket.name,
        ticketType: cartItem.ticket.type,
        eventId: cartItem.ticket.eventId,
        quantity: cartItem.quantity,
        unitPrice: cartItem.price,
        totalPrice: cartItem.price * cartItem.quantity,
        paymentMethod: payment.method,
        paymentStatus: payment.status,
        paymentDate: payment.paymentDate,
        reference: payment.reference,
        cartId: payment.cart.id,
      });
    });
  });

  return processedTickets;
}

// Contar total de bilhetes
export function countTotalTickets(payments: UserTicket[]): number {
  return payments.reduce((total, payment) => {
    return total + payment.cart.cartItems.reduce((cartTotal, item) => cartTotal + item.quantity, 0);
  }, 0);
}

// Calcular valor total gasto
export function calculateTotalSpent(payments: UserTicket[]): number {
  return payments.reduce((total, payment) => total + payment.amount, 0);
}

// Determinar categoria favorita baseada nos bilhetes
export function getFavoriteCategory(payments: UserTicket[]): string {
  if (payments.length === 0) return 'Música';
  
  const categories = payments.reduce((acc, payment) => {
    payment.cart.cartItems.forEach(cartItem => {
      const category = cartItem.ticket.type.toLowerCase();
      acc[category] = (acc[category] || 0) + cartItem.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const favorite = Object.entries(categories).reduce((max, [category, count]) => 
    count > max.count ? { category, count } : max, 
    { category: 'Música', count: 0 }
  );

  return favorite.category.charAt(0).toUpperCase() + favorite.category.slice(1);
}

// Converter ProcessedTicket para formato local (compatibilidade)
export function convertToLocalTickets(processedTickets: ProcessedTicket[]): Array<{
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketCode: string;
  ticketType: string;
  price: number;
  purchaseDate: string;
  status: 'active' | 'used';
  qrCode: string;
}> {
  return processedTickets.map((ticket, index) => ({
    id: ticket.paymentId + '-' + ticket.ticketId,
    eventName: `Evento - ${ticket.ticketName}`,
    eventDate: new Date(ticket.paymentDate).toISOString().split('T')[0],
    eventTime: '20:00',
    eventLocation: 'Local do Evento',
    ticketCode: ticket.reference || `TKT-${ticket.ticketId.slice(0, 8).toUpperCase()}`,
    ticketType: ticket.ticketType.toUpperCase(),
    price: ticket.totalPrice,
    purchaseDate: ticket.paymentDate.split('T')[0],
    status: 'active',
    qrCode: ''
  }));
}