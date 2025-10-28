export default function BusinessMentorshipCTA() {
  return (
    <section className="w-full px-4 py-16 relative overflow-hidden bg-gradient-to-b from-secondary/0 to-secondary/10 p-12 md:p-16 lg:p-20">
      {/* Container principal da imagem com textos flutuantes */}
      <div className="absolute left-0 top-0 h-full w-1/2">
        <div className="relative h-full">
          {/* Imagem principal */}
          <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-80 h-80 md:w-[400px] md:h-[400px] lg:w-[400px] lg:h-[400px] overflow-hidden shadow-2xl rounded-2xl">
            <img 
              src="/images/Mentorempresa.png"
              alt="Mentoria para Empresas"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Textos flutuantes decorativos - ajustados */}
          <div className="absolute left-[10%] top-1/4 animate-float">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200">
              <span className="text-sm font-semibold text-primary">Sucesso</span>
            </div>
          </div>

          <div className="absolute left-[55%] bottom-1/3 animate-float" style={{ animationDelay: '1.2s' }}>
            <div className="bg-secondary/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-secondary/70">
              <span className="text-sm font-semibold text-white">Liderança</span>
            </div>
          </div>

          {/* <div className="absolute left-[35%] bottom-1/5 animate-float" style={{ animationDelay: '2.4s' }}>
            <div className="bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-primary/70">
              <span className="text-sm font-semibold text-white">Crescimento</span>
            </div>
          </div>

          <div className="absolute left-[25%] top-1/5 animate-float" style={{ animationDelay: '0.6s' }}>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200">
              <span className="text-sm font-semibold text-primary">Resultados</span>
            </div>
          </div> */}

          {/* Elementos decorativos adicionais */}
          <div className="absolute left-[8%] top-1/2 w-20 h-20 bg-primary/10 rounded-full blur-xl  opacity-95 animate-pulse border border-primary/20"></div>
          <div className="absolute left-[45%] bottom-1/4 w-14 h-14 bg-secondary/10 blur-xl opacity-95 rounded-full animate-pulse border border-secondary/20" style={{ animationDuration: '3s' }}></div>
          <div className="absolute left-[0%] top-2/3 w-12 h-12 bg-primary/5 rounded-full blur-xl opacity-95 animate-pulse border border-primary/10" style={{ animationDuration: '4s' }}></div>
        </div>
      </div>

      {/* Conteúdo alinhado à direita */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-end">
          <div className="max-w-2xl text-right">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
              Mentoria para <span className="text-secondary">Empresas</span>
            </h2>
            
            <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
              Desenvolva seus líderes e equipes com programas de mentoria personalizados e transforme o potencial da sua organização.
            </p>

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
              <button className="group relative bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-between min-w-[200px] shadow-lg hover:shadow-xl border-2 border-primary">
                <span>Saiba Mais</span>
                <div className="ml-4 w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors flex items-center justify-center border border-white/30">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}