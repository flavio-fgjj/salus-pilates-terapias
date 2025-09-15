import { Link } from 'react-scroll';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <nav className="flex justify-between items-center px-6 py-4">
        <div className="text-xl font-bold">Salus</div>
        <ul className="flex gap-6">
          <li><Link className="cursor-pointer hover:text-[#B7D0CA] transition" to="pilates" smooth={true} duration={500}>Pilates</Link></li>
          <li><Link className="cursor-pointer hover:text-[#B7D0CA] transition" to="servicos" smooth={true} duration={500}>Serviços</Link></li>
          <li><Link className="cursor-pointer hover:text-[#B7D0CA] transition" to="infantil" smooth={true} duration={500}>Infantil</Link></li>
          <li><Link className="cursor-pointer hover:text-[#B7D0CA] transition" to="sobre" smooth={true} duration={500}>Sobre</Link></li>
          <li><Link className="cursor-pointer hover:text-[#B7D0CA] transition" to="contato" smooth={true} duration={500}>Contato</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
