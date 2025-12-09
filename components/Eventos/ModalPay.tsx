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
import { toast } from 'sonner';
import { directPayment } from '@/lib/actions/payment-direct-actions';

interface ModalPayProps {
  isOpen: boolean;
  onClose: () => void;
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
}

interface PaymentMethod {
  id: 'mpesa' | 'transference';
  name: string;
  icon: any;
  description: string;
}

export default function ModalPay({ isOpen, onClose, event, tickets }: ModalPayProps) {
  const [selectedPayment, setSelectedPayment] = useState<'mpesa' | 'transference'>('mpesa');
  const [processing, setProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calcular totais
  const totalAmount = tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  const totalItems = tickets.reduce((total, ticket) => total + ticket.quantity, 0);

  const paymentMethods: PaymentMethod[] = [
    { 
      id: 'mpesa', 
      name: 'M-Pesa', 
      icon: Smartphone, 
      description: 'Pagamento rápido via M-Pesa' 
    },
    { 
      id: 'transference', 
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

  // Preparar items no formato correto
  const getPaymentItems = () => {
    return tickets
      .filter(ticket => ticket.quantity > 0)
      .map(ticket => ({
        ticketId: ticket.id,
        quantity: ticket.quantity.toString()
      }));
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

  const validatePhoneNumber = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 9) {
      return false;
    }
    if (!cleanedPhone.startsWith('84') && !cleanedPhone.startsWith('85')) {
      return false;
    }
    return true;
  };

  const processMpesaPayment = async () => {
    if (!phoneNumber) {
      toast.error('Por favor, insira o número de telefone');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Número de telefone inválido. Deve começar com 84 ou 85 e ter 9 dígitos');
      return;
    }

    const paymentItems = getPaymentItems();
    if (paymentItems.length === 0) {
      toast.error('Nenhum item selecionado');
      return;
    }

    setProcessing(true);
    const loadingToast = toast.loading('Processando pagamento M-Pesa...');

    try {
      const payload = {
        paymentMethod: "mpesa" as const,
        phoneNumber: phoneNumber.trim(),
        items: paymentItems
      };

      console.log('🔄 Enviando payload M-Pesa:', payload);

      const result = await directPayment(payload);
      toast.dismiss(loadingToast);

      console.log('📦 Resposta M-Pesa:', result);

      if (result.success) {
        toast.success(result.mensagem || 'Pagamento realizado com sucesso!');
        onClose();
      } else {
        toast.error(result.mensagem || 'Erro ao processar pagamento');
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

    const paymentItems = getPaymentItems();
    if (paymentItems.length === 0) {
      toast.error('Nenhum item selecionado');
      return;
    }

    setProcessing(true);
    const loadingToast = toast.loading('Processando transferência...');

    try {
      const payload = {
        paymentMethod: "transference" as const,
        phoneNumber: undefined,
        items: paymentItems
      };

      console.log('🔄 Enviando payload Transferência:', payload);
      
      const result = await directPayment(payload);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success('Pedido de transferência enviado! Envie o comprovativo.');
        onClose();
      } else {
        toast.error(result.mensagem || 'Erro ao processar transferência');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Erro inesperado. Tente novamente.');
      console.error('Erro na transferência:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (totalItems === 0) {
      toast.error('Selecione pelo menos um bilhete');
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

          {/* Modal - Layout Responsivo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
          >
            <div className="bg-background rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
              
              {/* Header - Responsivo */}
              <div className="flex items-center justify-between mt-12 p-4 sm:p-6 border-b border-border">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
                    Finalizar Compra
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                    {event.title} • {totalItems} {totalItems === 1 ? 'bilhete' : 'bilhetes'}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0 ml-2"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conteúdo Principal - Scrollável */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  
                  {/* Resumo - Responsivo */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3 text-base sm:text-lg">
                      Resumo do Pedido
                    </h3>
                    <div className="space-y-3">
                      {tickets.map((ticket, index) => (
                        ticket.quantity > 0 && (
                          <div 
                            key={ticket.id} 
                            className="flex justify-between items-start sm:items-center pb-3 border-b border-border last:border-0 last:pb-0"
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="font-medium text-sm sm:text-base truncate">
                                {ticket.name}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {ticket.quantity} × {formatCurrency(ticket.price)}
                              </div>
                            </div>
                            <div className="font-medium text-sm sm:text-base whitespace-nowrap">
                              {formatCurrency(ticket.price * ticket.quantity)}
                            </div>
                          </div>
                        )
                      ))}
                      <div className="pt-3 mt-3 border-t border-border">
                        <div className="flex justify-between text-base sm:text-lg font-bold">
                          <span>Total:</span>
                          <span>{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Método de Pagamento - Responsivo */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground text-base sm:text-lg">
                      Método de Pagamento
                    </h3>
                    
                    {/* Grid responsivo */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`p-3 sm:p-4 border-2 rounded-lg text-left transition-all ${
                            selectedPayment === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <method.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground text-sm sm:text-base truncate">
                                {method.name}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                {method.description}
                              </div>
                            </div>
                            {selectedPayment === method.id && (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Campos M-Pesa - Responsivo */}
                    {selectedPayment === 'mpesa' && (
                      <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium text-foreground text-sm sm:text-base">
                          Pagamento via M-Pesa
                        </h4>
                      <div>
  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
    Número de Telefone M-Pesa *
  </label>

  <input
    type="tel"
    value={phoneNumber}
    onChange={(e) => {
      let value = e.target.value.replace(/\D/g, ""); // remove não números

      // força máximo de 9 dígitos
      if (value.length > 9) {
        value = value.slice(0, 9);
      }

      // força começar com 84 ou 85
      if (value.length >= 2 && !value.startsWith("84") && !value.startsWith("85")) {
        value = "84"; // ou: value = ""; se quiser limpar em vez de corrigir automaticamente
      }

      setPhoneNumber(value);
    }}
    placeholder="84XXXXXXX ou 85XXXXXXX"
    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
      phoneNumber && phoneNumber.length !== 9 ? "border-red-500 focus:ring-red-400" : "border-border focus:ring-primary"
    }`}
  />

  {/* validação de erro */}
  {phoneNumber && phoneNumber.length !== 9 && (
    <p className="text-red-500 text-xs mt-1">O número deve ter 9 dígitos e começar com 84 ou 85.</p>
  )}
</div>

                      </div>
                    )}

                    {/* Campos Transferência - Responsivo */}
                    {selectedPayment === 'transference' && (
                      <div className="space-y-4 sm:space-y-6">
                        {/* Contas Bancárias */}
                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="font-medium text-foreground text-sm sm:text-base">
                            Contas Bancárias
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            {Object.entries(bankAccounts).map(([key, bank]) => (
                              <div key={key} className="bg-card border border-border rounded-lg p-3 sm:p-4">
                                <h5 className="font-semibold text-foreground text-sm sm:text-base mb-2 sm:mb-3 truncate">
                                  {bank.name}
                                </h5>
                                <div className="space-y-2 text-xs sm:text-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Conta:</span>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <span className="font-mono text-xs truncate max-w-[100px] sm:max-w-[120px]">
                                        {bank.conta}
                                      </span>
                                      <button
                                        onClick={() => copyToClipboard(bank.conta, `conta-${key}`)}
                                        className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                                        aria-label="Copiar número da conta"
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
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <span className="font-mono text-xs truncate max-w-[100px] sm:max-w-[120px]">
                                        {bank.nib}
                                      </span>
                                      <button
                                        onClick={() => copyToClipboard(bank.nib, `nib-${key}`)}
                                        className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                                        aria-label="Copiar NIB"
                                      >
                                        {copiedField === `nib-${key}` ? (
                                          <Check className="w-3 h-3 text-green-600" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="text-muted-foreground text-xs truncate">
                                    Titular: {bank.titular}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Comprovativo */}
                        <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium text-foreground text-sm sm:text-base">
                            Enviar Comprovativo
                          </h4>
                          
                          <div className="space-y-2">
                            

                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
                                Comprovativo de Transferência *
                              </label>
                              <div className="border-2 border-dashed border-border rounded-lg p-3 sm:p-4 text-center">
                                <input
                                  type="file"
                                  id="proof-upload"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                                <label
                                  htmlFor="proof-upload"
                                  className="cursor-pointer flex flex-col items-center gap-1 sm:gap-2"
                                >
                                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                                  <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-full">
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
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer - Responsivo e Fixo */}
              <div className="border-t border-border p-4 sm:p-6 bg-background sticky bottom-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-foreground whitespace-nowrap">
                    {formatCurrency(totalAmount)}
                  </div>
                </div>

                {/* Botão Principal - Grande e Acessível */}
                <button
                  onClick={handlePayment}
                  disabled={processing || 
                    totalItems === 0 ||
                    (selectedPayment === 'mpesa' && (!phoneNumber || !validatePhoneNumber(phoneNumber))) ||
                    (selectedPayment === 'transference' && (!proofImage || !referenceNumber))}
                  className="w-full py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg"
                >
                  {processing ? (
                    <>
                      <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="truncate">
                        {selectedPayment === 'mpesa' ? 'Processando...' : 'Enviando...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="truncate">
                        Pagar {formatCurrency(totalAmount)}
                      </span>
                    </>
                  )}
                </button>

                {/* Debug apenas em desktop */}
                {/* {process.env.NODE_ENV === 'development' && !isMobile && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs hidden sm:block">
                    <div className="font-semibold mb-1">Payload que será enviado:</div>
                    <pre className="whitespace-pre-wrap text-xs">
                      {JSON.stringify({
                        paymentMethod: selectedPayment,
                        phoneNumber: selectedPayment === 'mpesa' ? phoneNumber : undefined,
                        items: getPaymentItems()
                      }, null, 2)}
                    </pre>
                  </div>
                )} */}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}