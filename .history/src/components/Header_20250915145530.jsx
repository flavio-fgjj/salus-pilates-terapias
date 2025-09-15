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
            className="h-18 w-auto min-w-24"
          />
        </div>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8">
          <li><Link className="cursor-pointer text-slate-700 hover:text-[#B7D0CA] hover:bg-[#B7D0CA]/10 px-3 py-2 rounded-md transition-all duration-200 font-medium" to="pilates" smooth={true} duration={500}>Pilates</Link></li>
          <li><Link className="cursor-pointer text-slate-700 hover:text-[#B7D0CA] hover:bg-[#B7D0CA]/10 px-3 py-2 rounded-md transition-all duration-200 font-medium" to="servicos" smooth={true} duration={500}>Serviços</Link></li>
          <li><Link className="cursor-pointer text-slate-700 hover:text-[#B7D0CA] hover:bg-[#B7D0CA]/10 px-3 py-2 rounded-md transition-all duration-200 font-medium" to="infantil" smooth={true} duration={500}>Infantil</Link></li>
          <li><Link className="cursor-pointer text-slate-700 hover:text-[#B7D0CA] hover:bg-[#B7D0CA]/10 px-3 py-2 rounded-md transition-all duration-200 font-medium" to="sobre" smooth={true} duration={500}>Sobre</Link></li>
          <li><Link className="cursor-pointer text-slate-700 hover:text-[#B7D0CA] hover:bg-[#B7D0CA]/10 px-3 py-2 rounded-md transition-all duration-200 font-medium" to="contato" smooth={true} duration={500}>Contato</Link></li>
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
            <img 
              src="/src/assets/instagram.png" 
              alt="Instagram" 
              className="w-5 h-5"
            />
          </a>
          <a
            href="https://wa.me/5513996124760"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="WhatsApp"
          >
            <img 
              src="/src/assets/whatsapp.png" 
              alt="WhatsApp" 
              className="w-5 h-5"
            />
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
