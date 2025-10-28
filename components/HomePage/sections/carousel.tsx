
'use client';

import { motion } from 'framer-motion';
import {
    Code,
    Palette,
    BarChart3,
    Megaphone,
    Briefcase,
    Heart,
    Camera,
    Music,
    BookOpen,
    Cpu,
    Globe
} from 'lucide-react';

interface MentorshipArea {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    description: string;
    highlight?: boolean;
}

export function SimpleMentorshipCarousel() {
    const mentorshipAreas: MentorshipArea[] = [
        {
            id: '1',
            name: 'Tech & Dev',
            icon: Code,
            description: 'Programação e Tecnologia',
            highlight: true
        },
        {
            id: '2',
            name: 'Design',
            icon: Palette,
            description: 'UX/UI e Design Gráfico'
        },
        {
            id: '3',
            name: 'Data Science',
            icon: BarChart3,
            description: 'Análise de Dados e IA',
            highlight: true
        },
        {
            id: '4',
            name: 'Marketing',
            icon: Megaphone,
            description: 'Digital e Growth'
        },
        {
            id: '5',
            name: 'Negócios',
            icon: Briefcase,
            description: 'Startups e Gestão'
        },
        {
            id: '6',
            name: 'Saúde',
            icon: Heart,
            description: 'Bem-estar e Medicina'
        },
        {
            id: '7',
            name: 'Fotografia',
            icon: Camera,
            description: 'Arte Visual'
        },
        {
            id: '8',
            name: 'Música',
            icon: Music,
            description: 'Produção e Teoria'
        },
        {
            id: '9',
            name: 'Escrita',
            icon: BookOpen,
            description: 'Criativa e Técnica'
        },
        {
            id: '10',
            name: 'IA & ML',
            icon: Cpu,
            description: 'Inteligência Artificial',
            highlight: true
        }
    ];

    // Duplicar para efeito infinito
    const duplicatedAreas = [...mentorshipAreas, ...mentorshipAreas];

    return (
        <div className="py-16 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4">
                <h3 className="text-2xl font-bold text-center text-primary  dark:text-white mb-8">
                    Áreas de Mentoria
                </h3>

                <div className="relative">
                    {/* Gradients */}
                    <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />

                    <motion.div
                        className="flex gap-6"
                        animate={{ x: [0, -1980] }}
                        transition={{
                            x: { repeat: Infinity, repeatType: "loop", duration: 50, ease: "linear" },
                        }}
                    >
                        {duplicatedAreas.map((area, index) => (
                            <div key={index} className="flex-shrink-0 w-48">
                                <div
                                    className={`rounded-xl p-3 border flex items-center gap-2 transition-all duration-300 cursor-pointer ${area.highlight
                                            ? 'bg-white dark:bg-blue-900/20 border-gray-200 dark:border-blue-800'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    <area.icon className="w-5 h-5 text-secondary dark:text-gray-300" />
                                    <span className="text-sm font-medium whitespace-nowrap">
                                        {area.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

            </div>
        </div>
    );
}