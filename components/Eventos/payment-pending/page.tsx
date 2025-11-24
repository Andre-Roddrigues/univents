'use client';

import { motion } from 'framer-motion';
import { Clock, Mail, Home } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const cartId = searchParams.get('cart');
  const method = searchParams.get('method');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pagamento em Análise
          </h1>
          
          <p className="text-muted-foreground mb-4">
            Seu comprovativo foi recebido e está em análise. Você receberá os bilhetes por email assim que o pagamento for confirmado.
          </p>

          <div className="space-y-3 mb-6 text-sm text-left bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID do Pedido:</span>
              <span className="font-medium text-foreground">{cartId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método:</span>
              <span className="font-medium text-foreground capitalize">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-yellow-600">Em Análise</span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-2 px-4 border border-border text-foreground rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Contactar Suporte
            </button>
            
            <Link
              href="/eventos"
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Voltar aos Eventos
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}