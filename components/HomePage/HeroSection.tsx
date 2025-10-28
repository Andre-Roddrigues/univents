"use client";
import React, { useState, useEffect } from "react";

import { Users, Target, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import heroImage from "@/public/images/HeroMentor.jpeg";
import heroImage2 from "@/public/images/mentorhero1.jpeg";
import Link from "next/link";
import getAllBooks  from "@/lib/actions/books-actions";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [totalMentors, setTotalMentors] = useState(Number);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { books  } = await getAllBooks();
        setTotalMentors(books  ? books .length : 50);
      } catch (error) {
        console.error("Erro ao buscar mentores:", error);
      }
    };

    fetchMentors();
    setIsVisible(true);
  }, []);

  const features = [
    // { icon: <Users />, text: `Mais de ${totalMentors}+ mentores especializados` },
    { icon: <Target />, text: "Metas personalizadas" },
    { icon: <Clock />, text: "Acompanhamento contínuo" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary/5 to-secondary/10 dark:from-slate-600 dark:via-slate-900 overflow-hidden">
      <div className="container mx-auto px-8 lg:px-20 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-3xl text-primary md:text-4xl lg:text-6xl font-bold leading-tight">
              Transforme Sua Carreira com Mentoria de Excelência
            </h1>
            <p className="text-lg md:text-xl text-card-foreground leading-relaxed">
              Conecte-se com mentores experientes que vão guiar seu 
              desenvolvimento profissional. Alcance seus objetivos com 
              orientação personalizada e suporte contínuo em cada etapa 
              da sua jornada.
            </p>
            <div className="flex flex-wrap gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-card-foreground"
                >
                  <span className="text-secondary text-lg lg:text-xl">
                    {feature.icon}
                  </span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            <div className="space-x-4">
              <Button className="p-6">
                <Link href={"/mentores"}>Encontrar Meu Mentor</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[450px] lg:h-[600px] w-full">
              <Image
                src={heroImage}
                alt="Sessão de Mentoria"
                className="absolute top-0 right-0 w-4/5 h-4/5 object-cover object-left rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />

              <Image
                src={heroImage2}
                alt="Networking Profissional"
                className="absolute bottom-0 left-0 w-3/5 h-3/5 object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;