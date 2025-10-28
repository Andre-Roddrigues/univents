// components/sections/WhyChooseUsMinimal.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Rocket,
    Users,
    Star,
    Target,
    Zap,
    Heart,
    Award,
    TrendingUp,
    Globe,
    Shield,
    Clock,
    Video,
    CheckCircle,
    ArrowRight,
    Calendar,
    MessageCircle,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WhyChooseUsMinimal() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const valueCards = [
        {
            icon: Target,
            title: 'Construção de Autoridade Interna',
            description:
                'O mentorado aprende a ser referência técnica e comportamental, tornando-se a escolha natural em processos de progressão.',
            stats: 'Ponto de referência.',
            color: 'blue'
        },
        {
            icon: Users,
            title: 'Mentoria Orientada a Decisões de Alto Impacto',
            description:
                'Actuação focada em projectos, iniciativas e entregas que aumentam a sua relevância perante líderes e directores.',
            stats: 'Promoções antecipadas',
            color: 'green'
        },
        {
            icon: TrendingUp,
            title: 'Gestão do Seu Progresso',
            description:
                'O mentorado recebe atualizações contínuas e notificações, permitindo acompanhar, controlar e otimizar cada sessão de forma prática e eficiente.',
            stats: 'Notificações e registros',
            color: 'purple'
        }
    ];



    const getColorClasses = (color: string) => {
        const classes = {
            blue: {
                iconBg: 'bg-blue-100 dark:bg-blue-900/30',
                iconColor: 'text-blue-600 dark:text-blue-400',
                border: 'border-blue-200 dark:border-blue-800'
            },
            green: {
                iconBg: 'bg-green-100 dark:bg-green-900/30',
                iconColor: 'text-green-600 dark:text-green-400',
                border: 'border-green-200 dark:border-green-800'
            },
            purple: {
                iconBg: 'bg-purple-100 dark:bg-purple-900/30',
                iconColor: 'text-purple-600 dark:text-purple-400',
                border: 'border-purple-200 dark:border-purple-800'
            }
        };
        return classes[color as keyof typeof classes];
    };

    return (
        <section className="py-10 bg-gradient-to-r from-secondary/5 via-transparent to-secondary/25  dark:bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Value Proposition with Cards */}
                <div
                    className=" bg-opacity-5 dark:bg-gray-800 rounded-2xl p-8 md:p-12 mb-16"
                >
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h3 className="text-2xl md:text-3xl font-bold  dark:text-white mb-6">
                                Não é só mentoria. <span className="text-primary"> É uma parceria para seu crescimento</span>
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                Cada sessão é um passo calculado em direção aos seus objectivos, com métricas claras e suporte contínuo.
                            </p>
                        </div>

                        {/* Value Cards Grid */}
                        <div
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"

                        >
                            {valueCards.map((card, index) => {
                                const colors = getColorClasses(card.color);

                                return (
                                    <div
                                        className={`bg-white dark:bg-gray-700 rounded-xl p-6 border ${colors.border} shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <card.icon className={`w-6 h-6 ${colors.iconColor}`} />
                                        </div>

                                        {/* Content */}
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            {card.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                                            {card.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                                            <BarChart3 className="w-3 h-3 mr-1" />
                                            {card.stats}
                                        </div>

                                        {/* Hover Effect Line */}
                                        <div className={`w-0 h-0.5 ${colors.iconBg} mt-3 group-hover:w-full transition-all duration-500`} />
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA Buttons */}
                        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <Rocket className="w-4 h-4 mr-2" />
                                Começar Minha Jornada
                            </Button>
                        </div> */}

                        {/* Trust Badges */}
                        <div
                            className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"

                        >
                            {[
                                { icon: Shield, text: 'Pagamento Seguro' },
                                { icon: Clock, text: 'Flexível' },
                                { icon: MessageCircle, text: 'Suporte 24/7' },
                                { icon: Calendar, text: 'Remarcar Grátis' }
                            ].map((badge, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <badge.icon className="w-4 h-4" />
                                    {badge.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center"
                >
                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Pronto para dar o próximo passo?
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                            Junte-se aos jovens que já transformaram suas carreiras com mentoria personalizada
                        </p>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Encontrar Meu Mentor Ideal
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Primeira sessão gratuita
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Cancelamento flexível
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Garantia de satisfação
                            </div>
                        </div>
                    </div>
                </motion.div> */}
            </div>
        </section>
    );
}