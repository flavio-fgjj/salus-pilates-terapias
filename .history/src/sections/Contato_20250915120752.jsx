const Contato = () => (
  <section id="contato" className="py-20 bg-white text-center">
    <div className="w-full px-4 md:px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Nosso Endereço</h2>
      <p className="text-slate-600 max-w-2xl mx-auto mb-8">Fale com a gente ou venha nos visitar.</p>
    </div>
    <div className="w-full h-[400px] max-w-5xl mx-auto mb-6 px-4 md:px-6">
      <iframe
        title="Mapa"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.7144079186333!2d-46.44062072466906!3d-23.65121026466692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce2cfa4f690961%3A0x6b6dfc0ac001f84a!2sAv.%20Pres.%20Kennedy%2C%2011862%20-%20Vila%20Cai%C3%A7ara%2C%20Praia%20Grande%20-%20SP%2C%2011705-750!5e0!3m2!1spt-BR!2sbr!4v1694822266113!5m2!1spt-BR!2sbr"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
    <div className="px-4 md:px-6">
      <p className="text-lg">Av. Pres. Kennedy, 11862 - Vila Caiçara, Praia Grande - SP</p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#B7D0CA] text-slate-800 font-semibold hover:opacity-90 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm12 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2A2.8 2.8 0 1 0 12 15.8 2.8 2.8 0 0 0 12 9.2z"/>
          </svg>
          Instagram
        </a>
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.6 0 .37 5.23.37 11.68c0 2.06.56 4.07 1.62 5.85L0 24l6.64-1.94a11.7 11.7 0 0 0 5.42 1.39h.01c6.46 0 11.69-5.23 11.69-11.68 0-3.13-1.22-6.07-3.24-8.29zM12.07 21.4h-.01c-1.74 0-3.45-.47-4.95-1.37l-.36-.21-3.94 1.15 1.14-3.84-.23-.39a9.7 9.7 0 0 1-1.47-5.06c0-5.37 4.37-9.74 9.75-9.74 2.6 0 5.05 1.01 6.9 2.85 1.85 1.85 2.86 4.3 2.86 6.89 0 5.37-4.37 9.72-9.64 9.72zm5.55-7.29c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.08-.3-.15-1.25-.46-2.39-1.48-.88-.78-1.47-1.74-1.64-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.24-.58-.49-.5-.68-.5l-.58-.01c-.2 0-.53.08-.81.38-.28.3-1.07 1.05-1.07 2.56 0 1.5 1.1 2.96 1.25 3.17.15.2 2.17 3.32 5.25 4.65.73.32 1.3.5 1.74.64.73.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.43.25-.7.25-1.3.17-1.43-.07-.13-.26-.2-.56-.35z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  </section>
);

export default Contato;
