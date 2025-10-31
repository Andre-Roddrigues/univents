'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  Ticket, 
  CreditCard, 
  Smartphone,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  Zap,
  Award
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: Calendar,
      title: 'Encontra o Evento Perfeito',
      description: 'Explora milhares de eventos por categoria, localização ou data. Filtra por música, workshops, tecnologia e muito mais!',
      features: ['Busca inteligente', 'Filtros avançados', 'Recomendações personalizadas'],
    },
    {
      step: '02',
      icon: Ticket,
      title: 'Escolhe Teu Bilhete',
      description: 'Seleciona entre diferentes tipos de bilhetes - normal, VIP, estudante - com preços transparentes.',
      features: ['Comparação de preços', 'Vários tipos de bilhete', 'Informação clara'],
    },
    {
      step: '03',
      icon: CreditCard,
      title: 'Pagamento Seguro',
      description: 'Paga de forma rápida e segura com M-Pesa, eMola, cartões. Transações 100% protegidas.',
      features: ['Múltiplos métodos', 'Pagamento instantâneo', 'Segurança garantida'],
    },
    {
      step: '04',
      icon: Smartphone,
      title: 'Recebe Teu Bilhete',
      description: 'Recebe o bilhete digital instantaneamente por email, com QR Code para acesso rápido.',
      features: ['Entrega imediata', 'QR Code incluído', 'Acesso no telemóvel'],
    },
    {
      step: '05',
      icon: Users,
      title: 'Partilha a Experiência',
      description: 'Convida amigos, partilha nas redes sociais e junta-te à comunidade de apaixonados por eventos.',
      features: ['Convites fáceis', 'Partilha social', 'Comunidade ativa'],
    },
    {
      step: '06',
      icon: MapPin,
      title: 'Desfruta do Evento',
      description: 'Apresenta o QR Code na entrada e mergulha numa experiência memorável com milhares de participantes!',
      features: ['Acesso rápido', 'Experiência única', 'Memórias para guardar'],
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Como funciona a{' '}
            <span className="text-secondary">Univents</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descobre, compra e vende bilhetes para os melhores eventos em Moçambique em apenas alguns cliques!
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              {/* Card */}
              <div className="relative rounded-xl p-6 bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 h-full hover:border-primary/20">
                
                {/* Step Number */}
                {/* <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm mb-4">
                  {step.step}
                </div> */}

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                  <step.icon className="w-6 h-6 text-secondary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {step.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-secondary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}