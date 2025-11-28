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
  Loader,
  Ticket,
  Check,
  X
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createPayment, createTransferPayment } from '@/lib/actions/payment-actions';
import { listCarts } from '@/lib/actions/cart-actions';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  ticketId: string;
  quantity: number;
  price: number;
  totalProductDiscount: number | null;
}

interface Cart {
  id: string;
  discount: number | null;
  totalPriceAftertDiscount: number | null;
  totalPrice: number;
  userId: string;
  status: 'pending' | 'paid' | 'canceled';
  cartItems: CartItem[];
}

interface PaymentMethod {
  id: 'mpesa' | 'transfer';
  name: string;
  icon: any;
  description: string;
  instructions: string;
}

// Função para converter File para base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

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
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      
      console.log('🛒 Carregando carrinho específico:', cartId);
      
      // Usar listCarts e filtrar pelo cartId específico
      const result = await listCarts();
      
      console.log('📦 Resposta da API:', result);
      
      if (result.success && Array.isArray(result.carts)) {
        // Encontrar o carrinho específico pelo ID
        const foundCart = result.carts.find((c: Cart) => c.id === cartId);
        
        if (foundCart) {
          console.log('✅ Carrinho encontrado:', foundCart);
          
          // Verificar se o carrinho está pending
          if (foundCart.status !== 'pending') {
            setError(`Este carrinho já foi ${foundCart.status === 'paid' ? 'pago' : 'cancelado'}`);
            setCart(foundCart);
            return;
          }
          
          setCart(foundCart);
        } else {
          console.error('❌ Carrinho não encontrado');
          setError('Carrinho não encontrado');
        }
      } else {
        console.error('❌ Erro ao carregar carrinhos:', result.message);
        setError(result.message || 'Erro ao carregar carrinho');
      }
    } catch (err) {
      console.error('💥 Erro ao carregar carrinho:', err);
      setError('Erro ao carregar carrinho');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas imagens');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }
      
      setProofImage(file);
    }
  };

  const processMpesaPayment = async () => {
    if (!phoneNumber) {
      toast.error('Por favor, insira o número de telefone');
      return;
    }

    if (!cart) return;

    setProcessing(true);
    
    const loadingToast = toast.loading('Processando pagamento M-Pesa...');

    try {
      const payload = {
        paymentMethod: "mpesa" as const,
        cartId: cart.id,
        phoneNumber: phoneNumber
      };

      console.log('💰 Enviando pagamento M-Pesa:', payload);

      const result = await createPayment(payload);

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(result.message || 'Pagamento realizado com sucesso!');
        router.push(`/eventos/payment-success?payment=${result.data?.payment?.id}&cart=${cart.id}&method=mpesa&amount=${cart.totalPrice}`);
      } else {
        toast.error(result.message || 'Erro ao processar pagamento');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Erro inesperado. Tente novamente.');
      console.error('Erro no pagamento M-Pesa:', error);
    } finally {
      setProcessing(false);
    }
  };

  const processTransferPayment = async () => {
    if (!proofImage) {
      toast.error('Por favor, faça upload do comprovativo');
      return;
    }

    if (!cart) return;

    setUploading(true);
    
    const loadingToast = toast.loading('Enviando comprovativo...');

    try {
      console.log('💰 Iniciando pagamento por transferência:', {
        cartId: cart.id,
        fileName: proofImage.name,
        fileSize: proofImage.size,
        fileType: proofImage.type
      });

      // Converter File para base64 antes de enviar para Server Action
      console.log('🔄 Convertendo arquivo para base64...');
      const base64String = await fileToBase64(proofImage);

      const fileData = {
        name: proofImage.name,
        type: proofImage.type,
        size: proofImage.size,
        base64: base64String
      };

      console.log('📤 Enviando dados do arquivo para Server Action...');

      // Usar a nova função createTransferPayment com dados serializáveis
      const result = await createTransferPayment(cart.id, fileData);

      toast.dismiss(loadingToast);

      if (result.success) {
        console.log('✅ Comprovativo enviado com sucesso:', result);
        toast.success(result.message || 'Comprovativo enviado com sucesso!');
        router.push(`/eventos/payment-pending?cart=${cart.id}&method=transfer&amount=${cart.totalPrice}`);
      } else {
        console.error('❌ Erro ao enviar comprovativo:', result);
        toast.error(result.message || 'Erro ao enviar comprovativo');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Erro inesperado. Tente novamente.');
      console.error('💥 Erro ao enviar comprovativo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handlePayment = async () => {
    if (!cart) return;

    console.log('🛒 Iniciando processo de pagamento:', {
      method: selectedPayment,
      cartId: cart.id,
      total: cart.totalPrice,
      status: cart.status
    });

    // Verificar novamente se o carrinho ainda está pending
    if (cart.status !== 'pending') {
      toast.error('Este carrinho já foi processado');
      return;
    }

    if (selectedPayment === 'mpesa') {
      await processMpesaPayment();
    } else {
      await processTransferPayment();
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    });
  };

  const getTicketDisplayInfo = (price: number, ticketId: string) => {
    if (price >= 9000) return { name: "Bilhete VIP", type: "vip" };
    if (price >= 5000) return { name: "Bilhete Normal", type: "normal" };
    return { name: `Bilhete ${ticketId.slice(0, 8)}`, type: "standard" };
  };

  // Renderizar estado do carrinho baseado no status
  const renderCartStatus = () => {
    if (!cart) return null;

    // Verificar se cartItems existe e é um array
    if (!cart.cartItems || !Array.isArray(cart.cartItems)) {
      return (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Erro no carrinho
          </h3>
          <p className="text-muted-foreground mb-6">
            Os dados do carrinho estão incompletos.
          </p>
          <Link
            href="/carrinho"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Voltar ao Carrinho
          </Link>
        </div>
      );
    }

    switch (cart.status) {
      case 'paid':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Compra Finalizada</h3>
            <p className="text-muted-foreground mb-6">
              Este carrinho já foi pago e processado com sucesso.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Total Pago:</span>
                <span className="font-bold">{formatCurrency(cart.totalPrice)}</span>
              </div>
              {/* <div className="text-sm text-green-700">
                ID do Carrinho: {cart.id}
              </div> */}
            </div>
            <div className="mt-8 space-y-4">
              <Link
                href="/meus-bilhetes"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Ver Meus Bilhetes
              </Link>
              <div>
                <Link
                  href="/eventos"
                  className="text-primary hover:underline"
                >
                  Continuar a explorar eventos
                </Link>
              </div>
            </div>
          </div>
        );

      case 'canceled':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Compra Cancelada</h3>
            <p className="text-muted-foreground mb-6">
              Este carrinho foi cancelado e não está mais disponível para pagamento.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Valor:</span>
                <span className="font-bold">{formatCurrency(cart.totalPrice)}</span>
              </div>
              {/* <div className="text-sm text-red-700">
                ID do Carrinho: {cart.id}
              </div> */}
            </div>
            <div className="mt-8 space-y-4">
              <Link
                href="/eventos"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Explorar Eventos
              </Link>
              <div>
                <Link
                  href="/carrinho"
                  className="text-primary hover:underline"
                >
                  Voltar ao carrinho
                </Link>
              </div>
            </div>
          </div>
        );

      case 'pending':
      default:
        return (
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
                  <div className="mt-2 text-sm text-muted-foreground">
                    ID do Carrinho: <span className="font-mono">{cartId}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                      PENDING
                    </span>
                  </div>
                </div>

                {/* Resumo do Pedido */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Resumo do Pedido
                  </h2>
                  
                  <div className="space-y-4">
                    {cart.cartItems && cart.cartItems.length > 0 ? (
                      cart.cartItems.map((item, index) => {
                        const ticketInfo = getTicketDisplayInfo(item.price, item.ticketId);
                        
                        return (
                          <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Ticket className="w-8 h-8 text-primary" />
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-foreground mb-1">
                                    {ticketInfo.name}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      ticketInfo.type === 'vip' 
                                        ? 'bg-purple-100 text-purple-800' 
                                        : ticketInfo.type === 'normal'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {ticketInfo.type.toUpperCase()}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {item.quantity} × {formatCurrency(item.price)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="font-semibold text-foreground">
                                    {formatCurrency(item.price * item.quantity)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhum item no carrinho</p>
                      </div>
                    )}
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

            {/* Coluna Direita - Pagamento (APENAS PARA PENDING) */}
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

                {/* Botão de Pagamento (APENAS PARA PENDING) */}
                <button
                  onClick={handlePayment}
                  disabled={processing || uploading || 
                    (selectedPayment === 'mpesa' && !phoneNumber) ||
                    (selectedPayment === 'transfer' && !proofImage)}
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
        );
    }
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

  if (error && !cart) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {error || 'Carrinho não encontrado'}
          </h3>
          <p className="text-muted-foreground mb-6">
            O carrinho que procura não está disponível.
          </p>
          <Link
            href="/carrinho"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Voltar ao Carrinho
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
        {renderCartStatus()}
      </div>
    </div>
  );
}