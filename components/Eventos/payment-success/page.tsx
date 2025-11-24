'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const cartId = searchParams.get('cart');
  const method = searchParams.get('method');

  useEffect(() => {
    // Aqui você poderia marcar o pedido como pago na API
    console.log('Pagamento confirmado:', { cartId, method });
  }, [cartId, method]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pagamento Confirmado!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Seu pagamento foi processado com sucesso. Os bilhetes foram enviados para o seu email.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método:</span>
              <span className="font-medium text-foreground capitalize">{method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ID do Pedido:</span>
              <span className="font-medium text-foreground">{cartId}</span>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button className="flex-1 py-2 px-4 border border-border text-foreground rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Bilhetes
            </button>
            <button className="flex-1 py-2 px-4 border border-border text-foreground rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Reenviar
            </button>
          </div>

          <Link
            href="/eventos"
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors block"
          >
            Voltar aos Eventos
          </Link>
        </div>
      </motion.div>
    </div>
  );
}