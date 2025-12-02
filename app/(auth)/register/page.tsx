import RegisterForm from "@/components/forms/RegisterForm";
import Logo from "@/components/navbar/Logo";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <section className="hidden lg:flex 2xl:h-[700px] h-[500px] max-h-[800px] w-full 2xl:max-w-6xl max-w-[950px] rounded-2xl overflow-hidden lg:-mt-10 items-center justify-center shadow-2xl backdrop-blur-sm">
        <div className="w-full h-full">
          <div className="bg-primary h-full w-full flex items-center justify-center px-8 py-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6 backdrop-blur-sm">
                <Logo className="w-full h-full rounded-2xl" />
              </div>

              <h1 className="text-3xl font-bold text-primary-foreground mb-3 font-montserrat">
                UniVents
              </h1>

              <p className="text-blue-100 mb-8 font-playfair font-semibold">
                Conectando pessoas através de experiências memoráveis
              </p>

              <div className="space-y-3 text-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 gradient-secondary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">
                    Descubra os melhores eventos da sua região
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 gradient-secondary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">
                    Compartilhe e participe de eventos únicos
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 gradient-secondary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">
                    Conecte-se com pessoas que compartilham seus interesses
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-36 h-36 bg-bookTeal-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/20 rounded-full blur-lg"></div>
            <div className="absolute top-1/2 -left-10 w-28 h-28 bg-bookIndigo-400/15 rounded-full blur-lg"></div>
            <div className="absolute top-1/4 -right-8 w-20 h-20 bg-white/15 rounded-full blur-md"></div>
            <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-bookTeal-300/20 rounded-full blur-md"></div>
            <div className="absolute top-1/3 left-1/3 w-12 h-12 bg-bookIndigo-300/25 rounded-full blur-sm"></div>
          </div>
        </div>

        <RegisterForm />
      </section>

      {/* Layout Mobile/Tablet */}
      <section className="lg:hidden w-full max-w-md mx-auto">
        <div className="gradient-primary rounded-t-2xl px-6 py-8 text-center relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl mb-4 backdrop-blur-sm border border-white/30">
              <Logo className="w-full h-full rounded-xl" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2 font-montserrat">
              EventHub
            </h1>

            <p className="text-blue-100 text-sm sm:text-base font-playfair font-semibold mb-4">
              Sua plataforma completa para eventos
            </p>

            <div className="space-y-2 text-accent-foreground/75 text-sm pl-12">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 gradient-secondary rounded-full flex-shrink-0"></div>
                <span>Encontre eventos que combinam com você</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 gradient-secondary rounded-full flex-shrink-0"></div>
                <span>Organize seus próprios eventos facilmente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 gradient-secondary rounded-full flex-shrink-0"></div>
                <span>Conecte-se com comunidades de interesse</span>
              </div>
            </div>
          </div>

          <div className="absolute -top-3 -right-3 w-20 h-20 bg-bookTeal-400/20 rounded-full blur-lg"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/20 rounded-full blur-md"></div>
          <div className="absolute top-1/2 -left-6 w-18 h-18 bg-bookIndigo-400/15 rounded-full blur-md"></div>
        </div>

        <div className="bg-background/95 backdrop-blur-xl rounded-b-2xl shadow-2xl border-t-0 border border-white/20 max-h-[70vh] overflow-y-auto">
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}