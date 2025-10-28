import { Users, Target, Calendar, Star, Zap, Briefcase } from "lucide-react";
import Link from "next/link";
import React from "react";

function MentorshipFormatSection() {
  return (
    <section className="">
      <h2 className="text-2xl font-bold mb-6">Mentoria Individual</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden rounded-lg bg-blue-100 p-6 transition-all hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-blue-200 p-3 dark:bg-blue-800">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Mentoria Básica</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhamento personalizado 1:1
              </p>
            </div>
          </div>
          <Link
            href="/mentores?tipo=basica"
            className="absolute inset-0 z-10"
            aria-label="Ver Mentoria Básica"
          />
        </div>

        {/* <div className="group relative overflow-hidden rounded-lg bg-purple-100 p-6 transition-all hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-purple-200 p-3 dark:bg-purple-800">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Mentoria Express</h3>
              <p className="text-sm text-muted-foreground">
                Sessões rápidas e objetivas
              </p>
            </div>
          </div>
          <Link
            href="/mentores?tipo=express"
            className="absolute inset-0 z-10"
            aria-label="Ver Mentoria Express"
          />
        </div> */}

        

        <div className="group relative overflow-hidden rounded-lg bg-green-100 p-6 transition-all hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-200 p-3 dark:bg-green-800">
              <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Mentoria Executiva</h3>
              <p className="text-sm text-muted-foreground">
                Foco em liderança e carreira
              </p>
            </div>
          </div>
          <Link
            href="/mentores?tipo=executiva"
            className="absolute inset-0 z-10"
            aria-label="Ver Mentoria Executiva"
          />
        </div>

        {/* <div className="group relative overflow-hidden rounded-lg bg-red-100 p-6 transition-all hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-red-200 p-3 dark:bg-red-800">
              <Target className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Mentoria Especializada</h3>
              <p className="text-sm text-muted-foreground">
                Foco em área específica
              </p>
            </div>
          </div>
          <Link
            href="/mentores?tipo=especializada"
            className="absolute inset-0 z-10"
            aria-label="Ver Mentoria Especializada"
          />
        </div> */}

        <div className="group relative overflow-hidden rounded-lg bg-indigo-100 p-6 transition-all hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-indigo-200 p-3 dark:bg-indigo-800">
              <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Mentoria Contínua</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhamento de longo prazo
              </p>
            </div>
          </div>
          <Link
            href="/mentores?tipo=continua"
            className="absolute inset-0 z-10"
            aria-label="Ver Mentoria Contínua"
          />
        </div>
      </div>
    </section>
  );
}

export default MentorshipFormatSection;