"use client";
import React, { useState, useEffect } from "react";

import { Calendar, Ticket, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import heroImage from "@/public/images/HeroMentor.jpeg";
import heroImage2 from "@/public/images/mentorhero1.jpeg";
import Link from "next/link";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    // Simulação de fetch de eventos
    const fetchEvents = async () => {
      try {
        // Substituir por sua API real
        // const events = await getAllEvents();
        setTotalEvents(1250); // Número fictício para demonstração
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchEvents();
    setIsVisible(true);
  }, []);

  const features = [
    { 
      icon: <Ticket className="w-5 h-5" />, 
      text: "Pagamento 100% seguro" 
    },
    { 
      icon: <MapPin className="w-5 h-5" />, 
      text: "Todo Moçambique" 
    },
  ];

  return (
    <div className="min-h-screen  bg-gradient-to-r from-secondary/5 to-secondary/10 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-8 lg:px-20 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-white"
          >

            {/* Main Heading */}
            <h1 className="text-4xl text-primary md:text-5xl lg:text-6xl font-bold leading-tight">
              Explore, Compre e Vende Bilhetes para os{" "}
              <span className="bg-secondary bg-clip-text text-transparent">
                Melhores Eventos
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-900 leading-relaxed">
              Desde concertos épicos a workshops transformadores. 
              Tua próxima experiência memorável está a um clique de distância!
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center space-x-3 text-purple-100 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <span className="text-secondary">
                    {feature.icon}
                  </span>
                  <span className="font-medium text-primary">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button className="p-6 text-lg bg-secondary text-primary hover:bg-secondary/80 font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                <Link href={"/eventos"} className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Explorar Eventos
                </Link>
              </Button>
              
              <Button className="p-6 text-lg bg-primary border-2 border-primary text-white hover:bg-primary/80 font-bold rounded-xl backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1">
                <Link href={"/vender"} className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Vender Bilhetes
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[500px] lg:h-[650px] w-full">
              {/* Main Event Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute top-0 right-0 w-4/5 h-4/5"
              >
                <Image
                  src={heroImage}
                  alt="Concert Crowd Enjoying Music"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  priority
                />
              </motion.div>

              {/* Secondary Event Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-0 left-0 w-3/5 h-3/5"
              >
                <Image
                  src={heroImage2}
                  alt="Workshop and Business Event"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </motion.div>


            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;