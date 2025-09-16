import emailIcon from '/assets/e-mail.png';
import igIcon from '/assets/instagram.png';
import waIcon from '/assets/whatsapp.png';

const Contato = () => (
  <section id="contato" className="py-20 bg-white text-center">
    <div className="w-full px-4 md:px-6 overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Nosso Endereço em Praia Grande SP</h2>
      <p className="text-slate-600 max-w-2xl mx-auto mb-8">Fale com a gente ou venha nos visitar. Estamos localizados na Av. Pres. Kennedy, Vila Caiçara, Praia Grande - SP.</p>
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
    <div className="px-4 md:px-6 overflow-hidden">
      <p className="text-lg">Av. Pres. Kennedy, 11862 - Vila Caiçara, Praia Grande - SP</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href="mailto:contato@salus.com"
          className="inline-flex items-center justify-center gap-2 w-32 px-4 py-2 rounded-md bg-transparent hover:bg-[#B7D0CA]/10 text-slate-800 border border-[#B7D0CA] font-semibold transition"
        >
          <img src={emailIcon} alt="Email" className="w-6 h-6" />
          Email
        </a>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 w-32 px-4 py-2 rounded-md bg-transparent hover:bg-[#B7D0CA]/10 text-slate-800 border border-[#B7D0CA] font-semibold transition"
        >
          <img src={igIcon} alt="Instagram" className="w-6 h-6" />
          Instagram
        </a>
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 w-32 px-4 py-2 rounded-md bg-transparent hover:bg-emerald-50 text-emerald-600 border border-emerald-500 font-semibold transition"
        >
          <img src={waIcon} alt="WhatsApp" className="w-6 h-6" />
          WhatsApp
        </a>
      </div>
    </div>
  </section>
);

export default Contato;
