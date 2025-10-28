// components/booking/PaymentMethod.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, GraduationCap, FileText, Copy, Check } from 'lucide-react';

interface PaymentMethodProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  onCardDetailsChange?: (details: any) => void;
  onPhoneNumberChange?: (phone: string) => void;
  onStudentIdChange?: (studentId: string) => void;
  onProofUpload?: (file: File) => void;
  totalAmount?: number;
}

export function PaymentMethod({
  selectedMethod,
  onMethodChange,
  onCardDetailsChange,
  onPhoneNumberChange,
  onStudentIdChange,
  onProofUpload,
  totalAmount = 0
}: PaymentMethodProps) {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [studentId, setStudentId] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCardDetailChange = (field: string, value: string) => {
    const newDetails = { ...cardDetails, [field]: value };
    setCardDetails(newDetails);
    onCardDetailsChange?.(newDetails);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      onProofUpload?.(file);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
    }
  };

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

  const paymentMethods = [
    {
      id: 'card',
      name: 'Cartão de Crédito/Débito',
      icon: CreditCard,
      description: 'Pague usando o seu cartão Visa'
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Pague usando sua conta M-Pesa'
    },
    {
      id: 'emola',
      name: 'e-Mola',
      icon: Smartphone,
      description: 'Pague usando e-Mola'
    },
    {
      id: 'comprovativo',
      name: 'Transferência Bancária',
      icon: FileText,
      description: 'Envie comprovativo de transferência'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>
      
      <RadioGroup value={selectedMethod} onValueChange={onMethodChange} className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <RadioGroupItem value={method.id} id={method.id} />
            <div className="flex items-center space-x-3 flex-1">
              <method.icon className="w-6 h-6 text-gray-600" />
              <div className="flex-1">
                <Label htmlFor={method.id} className="font-medium cursor-pointer">
                  {method.name}
                </Label>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>

      {/* Detalhes do Cartão */}
      {selectedMethod === 'card' && (
        <div className="mt-6 p-4 border rounded-lg space-y-4">
          <h4 className="font-medium">Detalhes do Cartão</h4>
          
          <div>
            <Label htmlFor="cardName">Nome no Cartão</Label>
            <Input
              id="cardName"
              placeholder="João Silva"
              value={cardDetails.name}
              onChange={(e) => handleCardDetailChange('name', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChange={(e) => handleCardDetailChange('number', e.target.value)}
              maxLength={19}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Validade</Label>
              <Input
                id="expiry"
                placeholder="MM/AA"
                value={cardDetails.expiry}
                onChange={(e) => handleCardDetailChange('expiry', e.target.value)}
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => handleCardDetailChange('cvv', e.target.value)}
                maxLength={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* M-Pesa */}
      {selectedMethod === 'mpesa' && (
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-3">M-Pesa</h4>
          <div>
            <Label htmlFor="phoneNumber">Número de Telefone</Label>
            <Input
              id="phoneNumber"
              placeholder="+258 84 123 4567"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                onPhoneNumberChange?.(e.target.value);
              }}
            />
            <p className="text-sm text-gray-500 mt-2">
              Você receberá uma mensagem para confirmar o pagamento
            </p>
          </div>
        </div>
      )}

      {/* e-Mola */}
      {selectedMethod === 'emola' && (
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-3">e-Mola</h4>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Como pagar usando Emola:
              </h5>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Digite <strong>*898#</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Opção <strong>9</strong> → Pagamentos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Opção <strong>1</strong> → Comerciante</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>ID: <strong>801335</strong></span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('801335', 'emola-id')}
                    className="h-6 px-2"
                  >
                    {copiedField === 'emola-id' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Digite o valor: <strong>{totalAmount.toFixed(2)} MT</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Conteúdo: <strong>Mentoria</strong></span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('Mentoria', 'emola-content')}
                    className="h-6 px-2"
                  >
                    {copiedField === 'emola-content' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Confirme <strong>Unitec Moçambique US</strong></span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="proofUpload" className="block mb-2">
                Envie o comprovativo de transferência
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {proofFile ? proofFile.name : 'Faça upload do comprovativo (PDF, JPG, PNG)'}
                </p>
                <Input
                  id="proofUpload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label htmlFor="proofUpload">
                  <Button variant="outline" asChild>
                    <span>Selecionar Arquivo</span>
                  </Button>
                </Label>
                {proofFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Arquivo selecionado com sucesso
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tamanho máximo: 5MB. Formatos aceites: PDF, JPG, PNG
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comprovativo de Transferência */}
      {selectedMethod === 'comprovativo' && (
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-4">Transferência</h4>
          
          <div className="space-y-4">
            {/* Contas Bancárias */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-700 dark:text-gray-300">
                Faça a transferência para uma das nossas contas:
              </h5>
              
              {Object.entries(bankAccounts).map(([key, bank]) => (
                <div key={key} className="border rounded-lg p-4 space-y-2">
                  <h6 className="font-medium text-gray-900 dark:text-white">{bank.name}</h6>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Conta:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{bank.conta}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bank.conta, `${key}-conta`)}
                          className="h-6 px-2"
                        >
                          {copiedField === `${key}-conta` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">NIB:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{bank.nib}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bank.nib, `${key}-nib`)}
                          className="h-6 px-2"
                        >
                          {copiedField === `${key}-nib` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex items-center justify-between">
                      <span className="text-gray-600">Titular:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-right">{bank.titular}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bank.titular, `${key}-titular`)}
                          className="h-6 px-2"
                        >
                          {copiedField === `${key}-titular` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Valor da Transferência */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-800 dark:text-blue-200 font-medium">Valor a Transferir:</span>
                <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  {totalAmount.toFixed(2)} MT
                </span>
              </div>
            </div>

            {/* Upload do Comprovativo */}
            <div>
              <Label htmlFor="proofUpload" className="block mb-2">
                Envie o comprovativo de transferência
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {proofFile ? proofFile.name : 'Faça upload do comprovativo (PDF, JPG, PNG)'}
                </p>
                <Input
                  id="proofUpload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label htmlFor="proofUpload">
                  <Button variant="outline" asChild>
                    <span>Selecionar Arquivo</span>
                  </Button>
                </Label>
                {proofFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Arquivo selecionado com sucesso
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tamanho máximo: 5MB. Formatos aceites: PDF, JPG, PNG
              </p>
            </div>

            {/* Instruções */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <h6 className="font-medium text-gray-900 dark:text-white mb-2">
                ⓘ Instruções importantes:
              </h6>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Faça a transferência do valor exato de <strong>{totalAmount.toFixed(2)} MT</strong></li>
                <li>• Envie o comprovativo dentro de 24 horas</li>
                <li>• Sua sessão será confirmada após verificação do pagamento</li>
                <li>• Tempo de verificação: 1-2 horas úteis</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Pagamento Escolar */}
      {selectedMethod === 'escola' && (
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-3">Pagamento Escolar</h4>
          <div>
            <Label htmlFor="studentId">Número de Estudante</Label>
            <Input
              id="studentId"
              placeholder="202412345"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                onStudentIdChange?.(e.target.value);
              }}
            />
            <p className="text-sm text-gray-500 mt-2">
              Sua instituição será contactada para confirmação
            </p>
          </div>
        </div>
      )}
    </div>
  );
}