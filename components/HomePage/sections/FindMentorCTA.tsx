'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Star, Zap, CreditCard, VerifiedIcon, CircleXIcon } from 'lucide-react';
import Link from 'next/link';

export function FindMentorCTA() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { number: '500+', label: 'Mentores Especialistas' },
    { number: '4.9/5', label: 'Avaliação Média' },
    { number: '24h', label: 'Primeira Sessão' },
  ];

  return (
    <section className="py-16 bg-secondary/90 dark:from-primary/10 dark:to-secondary/5">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4 mr-2" />
            Comece Sua Jornada Hoje
          </motion.div> */}

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4"
          >
            Encontre Seu Mentor
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-primary dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Conecte-se com profissionais experientes que já trilharam o caminho que você quer seguir. 
            Mentoria personalizada para seus objetivos específicos.
          </motion.p>

          {/* Stats */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mb-8"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div> */}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Link href="/mentores">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-semibold"
            >
              <Users className="w-5 h-5 mr-2" />
              Ver Mentores
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-primary dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <VerifiedIcon className="w-4 h-4 text-primary" />
              Mentores verificados
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Pagamentos Seguros
            </div>
            <div className="flex items-center gap-2">
              <CircleXIcon className="w-4 h-4 text-primary" />
              Cancelamento flexível
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}