'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Smartphone, 
  CreditCard, 
  Upload, 
  CheckCircle, 
  Loader,
  Shield,
  Copy,
  Check
} from 'lucide-react';
import { createPayment, uploadTransferProof } from '@/lib/actions/payment-actions';
import { createCart } from '@/lib/actions/cart-actions';
import { toast } from 'sonner';

interface ModalPayProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
  };
  ticket: {
    id: string;
    name: string;
    price: number;
    type: string;
  };
  quantity: number;
  cartId: string;
}

interface PaymentMethod {
  id: 'mpesa' | 'transfer';
  name: string;
  icon: any;
  description: string;
}

export default function ModalPay({ isOpen, onClose, event, ticket, quantity }: ModalPayProps) {
  const [selectedPayment, setSelectedPayment] = useState<'mpesa' | 'transfer'>('mpesa');
  const [processing, setProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);

  const totalAmount = ticket.price * quantity;

  const paymentMethods: PaymentMethod[] = [
    { 
      id: 'mpesa', 
      name: 'M-Pesa', 
      icon: Smartphone, 
      description: 'Pagamento rápido via M-Pesa' 
    },
    { 
      id: 'transfer', 
      name: 'Transferência Bancária', 
      icon: CreditCard, 
      description: 'Transferência com comprovativo' 
    },
  ];

  const bankAccounts = {
    mbim: {
      name: "Millennium BIM",
      conta: "1024762418",
      nib: "000100000102476241857",
      titular: "Unitec Moçambique Lda.",
    },
    bci: {
      name: "BCI",
      conta: "25418442710001",
      nib: "000800005418442710113",
      titular: "Unitec Moçambique Lda.",
    },
    absa: {
      name: "ABSA",
      conta: "0014102004789",
      nib: "000200141410200478905",
      titular: "Unitec Moçambique Lda.",
    },
  };

  // Criar carrinho automaticamente quando o modal abre
  useEffect(() => {
    if (isOpen && !cartId) {
      createCartAutomatically();
    }
  }, [isOpen]);

  const createCartAutomatically = async () => {
    try {
      const payload = {
        items: [{
          ticketId: ticket.id,
          quantity: quantity.toString()
        }]
      };

      const result = await createCart(payload);
      
      if (result.success && result.data?.id) {
        setCartId(result.data.id);
      } else {
        toast.error('Erro ao criar carrinho');
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar carrinho:', error);
      toast.error('Erro ao processar pedido');
      onClose();
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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      toast.success('Copiado para a área de transferência');
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const processMpesaPayment = async () => {
    if (!phoneNumber) {
      toast.error('Por favor, insira o número de telefone');
      return;
    }

    if (!cartId) {
      toast.error('Erro ao processar pagamento. Tente novamente.');
      return;
    }

    setProcessing(true);
    const loadingToast = toast.loading('Processando pagamento M-Pesa...');

    try {
      const payload = {
        paymentMethod: "mpesa" as const,
        cartId: cartId,
        phoneNumber: phoneNumber
      };

      const result = await createPayment(payload);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(result.message || 'Pagamento realizado com sucesso!');
        onClose();
        // Redirecionar para página de sucesso se necessário
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

    if (!referenceNumber) {
      toast.error('Por favor, insira o número de referência');
      return;
    }

    if (!cartId) return;

    setProcessing(true);
    const loadingToast = toast.loading('Enviando comprovativo...');

    try {
      const result = await uploadTransferProof(cartId, referenceNumber, proofImage);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(result.message || 'Comprovativo enviado com sucesso!');
        onClose();
        // Redirecionar para página pendente se necessário
      } else {
        toast.error(result.message || 'Erro ao enviar comprovativo');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Erro inesperado. Tente novamente.');
      console.error('Erro ao enviar comprovativo:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!cartId) {
      toast.error('Aguarde o carregamento do pedido');
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-background rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Finalizar Compra</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.title} • {ticket.name} × {quantity}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-6 space-y-6">
                  {/* Resumo */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">Resumo do Pedido</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Evento:</span>
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bilhete:</span>
                        <span className="font-medium">{ticket.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantidade:</span>
                        <span className="font-medium">{quantity}</span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Método de Pagamento */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Método de Pagamento</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            selectedPayment === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <method.icon className="w-5 h-5 text-primary" />
                            <div>
                              <div className="font-medium text-foreground">{method.name}</div>
                              <div className="text-sm text-muted-foreground">{method.description}</div>
                            </div>
                            {selectedPayment === method.id && (
                              <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Campos M-Pesa */}
                    {selectedPayment === 'mpesa' && (
                      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium text-foreground">Pagamento via M-Pesa</h4>
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

                    {/* Campos Transferência */}
                    {selectedPayment === 'transfer' && (
                      <div className="space-y-6">
                        {/* Contas Bancárias */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-foreground">Contas Bancárias</h4>
                          <div className="space-y-3">
                            {Object.entries(bankAccounts).map(([key, bank]) => (
                              <div key={key} className="bg-card border border-border rounded-lg p-4">
                                <h5 className="font-semibold text-foreground mb-3">{bank.name}</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Conta:</span>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono">{bank.conta}</span>
                                      <button
                                        onClick={() => copyToClipboard(bank.conta, `conta-${key}`)}
                                        className="p-1 hover:bg-muted rounded transition-colors"
                                      >
                                        {copiedField === `conta-${key}` ? (
                                          <Check className="w-3 h-3 text-green-600" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">NIB:</span>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono">{bank.nib}</span>
                                      <button
                                        onClick={() => copyToClipboard(bank.nib, `nib-${key}`)}
                                        className="p-1 hover:bg-muted rounded transition-colors"
                                      >
                                        {copiedField === `nib-${key}` ? (
                                          <Check className="w-3 h-3 text-green-600" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="text-muted-foreground text-xs">
                                    Titular: {bank.titular}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Instruções Emola */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Como pagar usando Emola:
                          </h4>
                          <div className="space-y-1 text-sm text-blue-800">
                            <div className="flex gap-2">
                              <span className="font-semibold">1.</span>
                              <span>Digite *898#</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-semibold">2.</span>
                              <span>Opção 9 → Pagamentos</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-semibold">3.</span>
                              <span>Opção 1 → Comerciante</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-semibold">4.</span>
                              <span>ID: <strong>801335</strong></span>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-semibold">5.</span>
                              <span>Digite o valor: <strong>{totalAmount} MT</strong></span>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-semibold">6.</span>
                              <span>Conteúdo: <strong>ticket</strong></span>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-semibold">7.</span>
                              <span>Confirme Unitec Moçambique US</span>
                            </div>
                          </div>
                        </div>

                        {/* Comprovativo */}
                        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium text-foreground">Enviar Comprovativo</h4>
                          
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Número de Referência
                            </label>
                            <input
                              type="text"
                              value={referenceNumber}
                              onChange={(e) => setReferenceNumber(e.target.value)}
                              placeholder="Número da transferência"
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    Pagamento 100% seguro
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {formatCurrency(totalAmount)}
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing || !cartId || 
                    (selectedPayment === 'mpesa' && !phoneNumber) ||
                    (selectedPayment === 'transfer' && (!proofImage || !referenceNumber))}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      {selectedPayment === 'mpesa' ? 'Processando...' : 'Enviando...'}
                    </>
                  ) : (
                    `Pagar ${formatCurrency(totalAmount)}`
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}