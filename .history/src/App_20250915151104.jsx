import Header from './components/Header';
import Footer from './components/Footer';

import Hero from './sections/Hero';
import Pilates from './sections/Pilates';
import Servicos from './sections/Servicos';
import Infantil from './sections/Infantil';
import Sobre from './sections/Sobre';
import Contato from './sections/Contato';

function App() {
  return (
    <div>
      <Header />
      <main className="pt-20">
        <Hero />
        <Pilates />
        <Servicos />
        <Infantil />
        <Sobre />
        <Contato />
      </main>
      <Footer />
      {/* Box de Promoção */}
      <div className="fixed bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs bg-white rounded-xl shadow-2xl border border-[#B7D0CA]/20 p-4 z-50 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-[#B7D0CA] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🎁</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-800 text-sm mb-1">Promoção Especial!</h4>
            <p className="text-xs text-slate-600 mb-3">
              Faça sua inscrição no Pilates e ganhe uma sessão de terapia grátis (acupuntura ou massagem)
            </p>
            <a
              href="https://wa.me/5513996124760?text=Olá! Gostaria de saber mais sobre a promoção do Pilates com terapia grátis."
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-[#B7D0CA] hover:bg-[#B7D0CA]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition"
            >
              Quero aproveitar!
            </a>
          </div>
          <button
            onClick={() => document.querySelector('.fixed.bottom-6.left-6').style.display = 'none'}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition"
            aria-label="Fechar promoção"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Botão WhatsApp */}
      <a
        href="https://wa.me/5513996124760"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-4 sm:right-6 inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg bg-[#25D366] hover:brightness-95 text-white z-50"
        aria-label="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.6 0 .37 5.23.37 11.68c0 2.06.56 4.07 1.62 5.85L0 24l6.64-1.94a11.7 11.7 0 0 0 5.42 1.39h.01c6.46 0 11.69-5.23 11.69-11.68 0-3.13-1.22-6.07-3.24-8.29zM12.07 21.4h-.01c-1.74 0-3.45-.47-4.95-1.37l-.36-.21-3.94 1.15 1.14-3.84-.23-.39a9.7 9.7 0 0 1-1.47-5.06c0-5.37 4.37-9.74 9.75-9.74 2.6 0 5.05 1.01 6.9 2.85 1.85 1.85 2.86 4.3 2.86 6.89 0 5.37-4.37 9.72-9.64 9.72zm5.55-7.29c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.08-.3-.15-1.25-.46-2.39-1.48-.88-.78-1.47-1.74-1.64-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.24-.58-.49-.5-.68-.5l-.58-.01c-.2 0-.53.08-.81.38-.28.3-1.07 1.05-1.07 2.56 0 1.5 1.1 2.96 1.25 3.17.15.2 2.17 3.32 5.25 4.65.73.32 1.3.5 1.74.64.73.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.43.25-.7.25-1.3.17-1.43-.07-.13-.26-.2-.56-.35z"/>
        </svg>
      </a>
    </div>
  );
}

export default App;
