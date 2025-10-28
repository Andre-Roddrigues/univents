import Link from "next/link";

export default function BusinessMentorshipCTA() {
  return (
    <section className="w-full px-4 py-16 relative overflow-hidden bg-gradient-to-b from-secondary/0 to-secondary/10 p-12 md:p-16 lg:p-20">
      {/* Imagem no lugar dos círculos */}
      <div className="absolute left-0 top-0 h-full w-1/2">
        <div className="absolute left-[5%] top-1/2 -translate-y-1/2 h-[90%] aspect-square rounded-full overflow-hidden">
          <img 
            src="/images/empresa.jpg"
            alt="Mentoria para Empresas"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Conteúdo alinhado à direita */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-end">
          <div className="max-w-6xl text-right">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
              Mentoria para <span className="text-secondary">Empresas</span>
            </h2>
            <div className="max-w-2xl">
            <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
              Desenvolva seus líderes e equipes com programas de mentoria personalizados e transforme o potencial da sua organização.
            </p>
            </div>

            {/* Destaques alinhados à direita */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 justify-items-end">
              <div className="flex items-center text-gray-600">
                <span>Programas customizados</span>
                <div className="w-2 h-2 bg-secondary rounded-full ml-3"></div>
              </div>
              <div className="flex items-center text-gray-600">
                <span>Desenvolvimento de liderança</span>
                <div className="w-2 h-2 bg-secondary rounded-full ml-3"></div>
              </div>
              <div className="flex items-center text-gray-600">
                <span>Mentores especializados</span>
                <div className="w-2 h-2 bg-secondary rounded-full ml-3"></div>
              </div>
              <div className="flex items-center text-gray-600">
                <span>Métricas de resultados</span>
                <div className="w-2 h-2 bg-secondary rounded-full ml-3"></div>
              </div>
            </div>

            {/* Botões alinhados à direita */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Link href="https://unitec.co.mz/">
              <button className="group relative bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-between min-w-[200px] shadow-lg hover:shadow-xl">
                <span>Saiba Mais</span>
                <div className="ml-4 w-6 h-6 rounded-full bg-blue-600/20 group-hover:bg-white/70 transition-colors flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}