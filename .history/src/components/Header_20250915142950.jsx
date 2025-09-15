import { Link } from 'react-scroll';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <nav className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <img 
            src="/src/assets/logo-header.png" 
            alt="Salus Pilates e Terapias" 
            className="h-18 w-auto"
          />
        </div>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6">
          <li><Link className="cursor-pointer hover:text-[#B7D0CA] transition" to="pilates" smooth={true} duration={500}>Pilates</Link></li>
          <li><Link className="cursor-pointer hover:text-[#B7D0CA] transition" to="servicos" smooth={true} duration={500}>Serviços</Link></li>
          <li><Link className="cursor-pointer hover:text-[#B7D0CA] transition" to="infantil" smooth={true} duration={500}>Infantil</Link></li>
          <li><Link className="cursor-pointer hover:text-[#B7D0CA] transition" to="sobre" smooth={true} duration={500}>Sobre</Link></li>
          <li><Link className="cursor-pointer hover:text-[#B7D0CA] transition" to="contato" smooth={true} duration={500}>Contato</Link></li>
        </ul>

        {/* Mobile Menu Button and Social Icons */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href="https://www.instagram.com/espacosalusbr"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#B7D0CA]">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm12 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2A2.8 2.8 0 1 0 12 15.8 2.8 2.8 0 0 0 12 9.2z"/>
            </svg>
          </a>
          <a
            href="https://wa.me/5513996124760"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-500">
              <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.6 0 .37 5.23.37 11.68c0 2.06.56 4.07 1.62 5.85L0 24l6.64-1.94a11.7 11.7 0 0 0 5.42 1.39h.01c6.46 0 11.69-5.23 11.69-11.68 0-3.13-1.22-6.07-3.24-8.29zM12.07 21.4h-.01c-1.74 0-3.45-.47-4.95-1.37l-.36-.21-3.94 1.15 1.14-3.84-.23-.39a9.7 9.7 0 0 1-1.47-5.06c0-5.37 4.37-9.74 9.75-9.74 2.6 0 5.05 1.01 6.9 2.85 1.85 1.85 2.86 4.3 2.86 6.89 0 5.37-4.37 9.72-9.64 9.72zm5.55-7.29c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.08-.3-.15-1.25-.46-2.39-1.48-.88-.78-1.47-1.74-1.64-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.24-.58-.49-.5-.68-.5l-.58-.01c-.2 0-.53.08-.81.38-.28.3-1.07 1.05-1.07 2.56 0 1.5 1.1 2.96 1.25 3.17.15.2 2.17 3.32 5.25 4.65.73.32 1.3.5 1.74.64.73.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.43.25-.7.25-1.3.17-1.43-.07-.13-.26-.2-.56-.35z"/>
            </svg>
          </a>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <ul className="flex flex-col py-4">
            <li>
              <Link 
                className="block px-6 py-3 hover:bg-[#B7D0CA]/10 hover:text-[#B7D0CA] transition cursor-pointer" 
                to="pilates" 
                smooth={true} 
                duration={500}
                onClick={closeMenu}
              >
                Pilates
              </Link>
            </li>
            <li>
              <Link 
                className="block px-6 py-3 hover:bg-[#B7D0CA]/10 hover:text-[#B7D0CA] transition cursor-pointer" 
                to="servicos" 
                smooth={true} 
                duration={500}
                onClick={closeMenu}
              >
                Serviços
              </Link>
            </li>
            <li>
              <Link 
                className="block px-6 py-3 hover:bg-[#B7D0CA]/10 hover:text-[#B7D0CA] transition cursor-pointer" 
                to="infantil" 
                smooth={true} 
                duration={500}
                onClick={closeMenu}
              >
                Infantil
              </Link>
            </li>
            <li>
              <Link 
                className="block px-6 py-3 hover:bg-[#B7D0CA]/10 hover:text-[#B7D0CA] transition cursor-pointer" 
                to="sobre" 
                smooth={true} 
                duration={500}
                onClick={closeMenu}
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link 
                className="block px-6 py-3 hover:bg-[#B7D0CA]/10 hover:text-[#B7D0CA] transition cursor-pointer" 
                to="contato" 
                smooth={true} 
                duration={500}
                onClick={closeMenu}
              >
                Contato
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
