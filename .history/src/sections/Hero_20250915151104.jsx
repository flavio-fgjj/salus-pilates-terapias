const Hero = () => (
  <section className="py-20 bg-white">
    <div className="w-full px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-start">
            <img 
              src="/src/assets/logo.png" 
              alt="Salus Pilates e Terapias" 
              className="max-w-full h-auto"
            />
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-800">
              Pilates é equilíbrio, força e saúde
            </h1>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-slate-600 max-w-2xl">
              Recupere sua postura, respiração e energia com aulas pensadas para você.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <a href="#contato" className="inline-flex items-center justify-center rounded-md bg-[#B7D0CA] hover:brightness-95 text-slate-900 font-semibold px-6 py-3 shadow-lg/30 transition">
                Agendar aula
              </a>
              <a href="#sobre" className="inline-flex items-center justify-center rounded-md bg-transparent hover:bg-[#B7D0CA]/10 text-slate-800 border border-[#B7D0CA] font-semibold px-6 py-3 transition">
                Conheça a Salus
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
