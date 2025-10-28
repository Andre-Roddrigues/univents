import Link from "next/link";

export default function CTASection() {
    return (
        <section className="w-full px-4 py-12 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/35 to-secondary/25 p-12 md:p-16">
                    {/* Círculos decorativos no fundo */}
                    <div className="absolute right-0 top-0 h-full w-1/2 opacity-40">
                        <div className="absolute right-[-40%]  top-1/2 -translate-y-1/2 h-[150%] aspect-square rounded-full bg-primary/50"></div>
                        <div className="absolute right-[-35%]  top-1/2 -translate-y-1/2 h-[130%] aspect-square rounded-full bg-blue-200/30"></div>
                        <div className="absolute right-[-30%]  top-1/2 -translate-y-1/2 h-[110%] aspect-square rounded-full bg-blue-100/30"></div>
                        <div className="absolute right-[-25%]  top-1/2 -translate-y-1/2 h-[80%] aspect-square rounded-full bg-white/20"></div>
                    </div>

                    {/* Conteúdo */}
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Torne-se Mentor.
                        </h2>
                        <p className="text-white text-lg md:text-xl mb-8 max-w-md">
                            Sua jornada de mentoria deve servir a você, não o contrário. Estamos felizes em ajudá-lo.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="https://unitec.co.mz/">
                                <button className="group relative bg-primary hover:bg-primary/70 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-between min-w-[220px]">
                                    <span>Torne-se Mentor</span>
                                    <div className="ml-4 w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
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