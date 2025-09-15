const Footer = () => (
  <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-white py-12">
    <div className="w-full px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-3 text-[#B7D0CA]">Salus</h3>
            <p className="text-slate-300 text-sm">
              Pilates e Terapias para seu bem-estar e qualidade de vida.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-3 text-[#B7D0CA]">Contato</h3>
            <p className="text-slate-300 text-sm mb-2">
              Av. Pres. Kennedy, 11862
            </p>
            <p className="text-slate-300 text-sm">
              Vila Caiçara, Praia Grande - SP
            </p>
          </div>
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-3 text-[#B7D0CA]">Redes Sociais</h3>
            <div className="flex justify-center md:justify-end gap-3">
              <a
                href="https://www.instagram.com/espacosalusbr"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-slate-700 hover:bg-[#B7D0CA] transition"
                aria-label="Instagram"
              >
                <img 
                  src="/src/assets/instagram.png" 
                  alt="Instagram" 
                  className="w-4 h-4"
                />
              </a>
              <a
                href="https://wa.me/5513996124760"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-slate-700 hover:bg-emerald-500 transition"
                aria-label="WhatsApp"
              >
                <img 
                  src="/src/assets/whatsapp.png" 
                  alt="WhatsApp" 
                  className="w-4 h-4"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Salus - Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
