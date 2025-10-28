// components/sections/HowItWorks.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Search, 
  Users, 
  Calendar, 
  Video, 
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HowItWorks() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      step: '01',
      icon: Search,
      title: 'Encontre Seu Mentor Ideal',
      description: 'Use nosso sistema de match inteligente para encontrar mentores que combinam com seus objetivos e área de interesse.',
      features: ['Busca por especialidade', 'Filtros avançados', 'Perfil detalhado']
    },
    {
      step: '02',
      icon: Users,
      title: 'Conheça e Conecte',
      description: 'Veja o perfil completo do mentor, avaliações de outros aprendizes e agende uma sessão de descoberta.',
      features: ['Perfil verificado', 'Avaliações reais', 'Sessão de descoberta']
    },
    {
      step: '03',
      icon: Calendar,
      title: 'Agende Sua Sessão',
      description: 'Escolha o melhor horário na agenda do mentor e selecione o tipo de sessão que atende suas necessidades.',
      features: ['Agenda integrada', 'Lembretes automáticos', 'Flexibilidade total']
    },
    {
      step: '04',
      icon: Video,
      title: 'Participe da Mentoria',
      description: 'Conecte-se via videochamada em nossa plataforma integrada ou presencialmente.',
      features: ['Plataforma integrada', 'Ferramentas colaborativas', 'Suporte técnico']
    },
    {
      step: '05',
      icon: Target,
      title: 'Acompanhe Seu Progresso',
      description: 'Receba feedback personalizado, defina metas e acompanhe sua evolução.',
      features: ['Dashboard pessoal', 'Metas mensuráveis', 'Feedback contínuo']
    },
    {
      step: '06',
      icon: Star,
      title: 'Avale e Evolua',
      description: 'Compartilhe sua experiência, avalie a sessão e continue sua jornada de aprendizado.',
      features: ['Sistema de rating', 'Comunidade ativa', 'Planos de continuidade']
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Flexível',
      description: 'Agende nos seus horários disponíveis',
      stat: '24/7'
    },
    {
      icon: Award,
      title: 'Qualidade',
      description: 'Mentores verificados e avaliados',
      stat: '4.9/5'
    },
    {
      icon: Zap,
      title: 'Rápido',
      description: 'Primeira sessão em até 24h',
      stat: '92%'
    },
    {
      icon: CheckCircle,
      title: 'Garantido',
      description: 'Satisfação garantida',
      stat: '100%'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

const itemVariants: Variants = {
  hidden: { 
    y: 20, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const itemVariantsSimple: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

  return (
    <section id="comoFunciona" className="py-16 bg-gradient-to-b from-secondary/0 to-secondary/10 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          
          <h2 className="text-3xl text-primary md:text-4xl font-bold  dark:text-white mb-4">
            Como funciona
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Um processo simples e direto para conectar você com mentores que fazem a diferença na sua carreira.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {steps.map((step) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-colors duration-300 group"
            >

              {/* Icon */}
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                <step.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold  dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {step.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-3 h-3 text-secondary mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        

        
      </div>
    </section>
  );
}