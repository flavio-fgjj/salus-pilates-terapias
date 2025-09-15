const Hero = () => (
  <section className="relative bg-[url('/src/assets/pilates-hero.jpg')] bg-cover bg-center h-[80vh] flex items-center justify-center text-white">
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
    <div className="relative w-full px-4 md:px-6">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
          Pilates é equilíbrio, força e saúde
        </h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
          Recupere sua postura, respiração e energia com aulas pensadas para você.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <a href="#contato" className="inline-flex items-center justify-center rounded-md bg-[#B7D0CA] hover:brightness-95 text-slate-900 font-semibold px-6 py-3 shadow-lg/30 transition">
            Agendar aula
          </a>
          <a href="#sobre" className="inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/15 backdrop-blur text-white border border-[#B7D0CA] font-semibold px-6 py-3 transition">
            Conheça a Salus
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
