'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle,
  Upload,
  FileText,
  Calendar,
  MapPin,
  Ticket,
  Loader
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
  id: string;
  ticketId: string;
  quantity: number;
  price: number;
  totalProductDiscount: number | null;
  ticket?: {
    id: string;
    name: string;
    type: string;
    event?: {
      id: string;
      title: string;
      img: string;
      startDate: string;
      location: string;
      province: string;
    };
  };
}

interface Cart {
  id: string;
  discount: number | null;
  totalPriceAfterDiscount: number | null;
  totalPrice: number;
  userId: string;
  cartItems: CartItem[];
}

interface PaymentMethod {
  id: 'mpesa' | 'transfer';
  name: string;
  icon: any;
  description: string;
  instructions: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const cartId = params.id as string;

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'mpesa' | 'transfer'>('mpesa');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const paymentMethods: PaymentMethod[] = [
    { 
      id: 'mpesa', 
      name: 'M-Pesa', 
      icon: Smartphone, 
      description: 'Pagamento rápido via M-Pesa',
      instructions: 'Você receberá um prompt de pagamento no seu telefone'
    },
    { 
      id: 'transfer', 
      name: 'Transferência Bancária', 
      icon: CreditCard, 
      description: 'Transferência com comprovativo',
      instructions: 'Faça a transferência e envie o comprovativo'
    },
  ];

  useEffect(() => {
    if (cartId) {
      loadCart();
    }
  }, [cartId]);

  const loadCart = async () => {
    try {
      setLoading(true);
      // Simular carregamento do carrinho da API
      // Substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - substituir por dados reais da API
      const mockCart: Cart = {
        id: cartId,
        discount: null,
        totalPriceAfterDiscount: null,
        totalPrice: 15000,
        userId: 'user-id',
        cartItems: [
          {
            id: 'item-1',
            ticketId: 'ticket-1',
            quantity: 2,
            price: 5000,
            totalProductDiscount: null,
            ticket: {
              id: 'ticket-1',
              name: 'Bilhete Normal',
              type: 'normal',
              event: {
                id: 'event-1',
                title: 'Show de Música Ao Vivo',
                img: '/placeholder-event.jpg',
                startDate: '2024-12-25T20:00:00Z',
                location: 'Auditório Principal',
                province: 'Maputo'
              }
            }
          },
          {
            id: 'item-2',
            ticketId: 'ticket-2',
            quantity: 1,
            price: 5000,
            totalProductDiscount: null,
            ticket: {
              id: 'ticket-2',
              name: 'Bilhete VIP',
              type: 'vip',
              event: {
                id: 'event-1',
                title: 'Show de Música Ao Vivo',
                img: '/placeholder-event.jpg',
                startDate: '2024-12-25T20:00:00Z',
                location: 'Auditório Principal',
                province: 'Maputo'
              }
            }
          }
        ]
      };
      
      setCart(mockCart);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas imagens');
        return;
      }
      
      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      
      setProofImage(file);
    }
  };

  const processMpesaPayment = async () => {
    if (!phoneNumber) {
      alert('Por favor, insira o número de telefone');
      return;
    }

    setProcessing(true);
    try {
      // Simular processamento M-Pesa
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Aqui você integraria com a API real do M-Pesa
      console.log('Processando pagamento M-Pesa:', {
        cartId,
        phoneNumber,
        amount: cart?.totalPrice
      });

      // Redirecionar para confirmação
      router.push(`/payment-success?cart=${cartId}&method=mpesa`);
    } catch (error) {
      console.error('Erro no pagamento M-Pesa:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  const processTransferPayment = async () => {
    if (!proofImage) {
      alert('Por favor, faça upload do comprovativo');
      return;
    }

    if (!referenceNumber) {
      alert('Por favor, insira o número de referência');
      return;
    }

    setUploading(true);
    try {
      // Simular upload do comprovativo
      const formData = new FormData();
      formData.append('proof', proofImage);
      formData.append('cartId', cartId);
      formData.append('reference', referenceNumber);
      formData.append('amount', cart?.totalPrice?.toString() || '0');

      // Aqui você enviaria o formData para a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Comprovativo enviado:', {
        cartId,
        referenceNumber,
        fileName: proofImage.name
      });

      // Redirecionar para confirmação
      router.push(`/payment-pending?cart=${cartId}&method=transfer`);
    } catch (error) {
      console.error('Erro ao enviar comprovativo:', error);
      alert('Erro ao enviar comprovativo. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handlePayment = async () => {
    if (selectedPayment === 'mpesa') {
      await processMpesaPayment();
    } else {
      await processTransferPayment();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">A carregar carrinho...</p>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Carrinho não encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            O carrinho que procura não está disponível.
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
            href="/carrinho"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao carrinho
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Coluna Esquerda - Resumo do Pedido */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Cabeçalho */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Finalizar Compra
                </h1>
                <p className="text-muted-foreground">
                  Complete seu pedido escolhendo o método de pagamento
                </p>
              </div>

              {/* Resumo do Pedido */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Resumo do Pedido
                </h2>
                
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                      <img
                        src={item.ticket?.event?.img || '/placeholder-event.jpg'}
                        alt={item.ticket?.event?.title || 'Evento'}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.ticket?.event?.title || 'Evento'}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="w-4 h-4" />
                          {item.ticket?.event && formatDate(item.ticket.event.startDate)}
                          <MapPin className="w-4 h-4 ml-2" />
                          {item.ticket?.event?.location}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-primary" />
                            <span className="font-medium">{item.ticket?.name}</span>
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              {item.ticket?.type?.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold text-foreground">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} × {formatCurrency(item.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>{formatCurrency(cart.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Pagamento */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Método de Pagamento */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Método de Pagamento
                </h2>
                
                <div className="space-y-3 mb-6">
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

                {/* Campos específicos por método */}
                {selectedPayment === 'mpesa' && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium text-foreground">Pagamento via M-Pesa</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {paymentMethods.find(m => m.id === 'mpesa')?.instructions}
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Número de Telefone M-Pesa
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="84 123 4567"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {selectedPayment === 'transfer' && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium text-foreground">Transferência Bancária</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {paymentMethods.find(m => m.id === 'transfer')?.instructions}
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Número de Referência
                      </label>
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="Número da transferência"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Comprovativo de Transferência
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <input
                          type="file"
                          id="proof-upload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="proof-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {proofImage ? proofImage.name : 'Clique para fazer upload'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            PNG, JPG (max 5MB)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Pagamento */}
              <button
                onClick={handlePayment}
                disabled={processing || uploading || 
                  (selectedPayment === 'mpesa' && !phoneNumber) ||
                  (selectedPayment === 'transfer' && (!proofImage || !referenceNumber))}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {processing || uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {selectedPayment === 'mpesa' ? 'Processando...' : 'Enviando...'}
                  </>
                ) : (
                  `Pagar ${formatCurrency(cart.totalPrice)}`
                )}
              </button>

              {/* Garantias */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  Pagamento 100% seguro
                </div>
                <div className="text-xs text-muted-foreground">
                  Sua transação está protegida
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}