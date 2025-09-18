import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Home, LogIn, UserPlus, LogOut, Menu, X, User, BookOpen, CreditCard, Smile, TrendingUp, DollarSign, HelpCircle } from 'react-feather';
import { useState } from 'react';
import colors from '../../theme/colors.js';
import { useUserStore } from '../../store/useUserStore.js';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const userStore = useUserStore();
  const role = userStore?.role;
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  const MenuItems = () => (
    <>
      <div className="flex-1">
        {user && (
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={isActive('/admin/dashboard') ? { backgroundColor: colors.primary, color: colors.buttonActiveText } : { color: colors.text }}
            onClick={closeMobileMenu}
          >
            <Home size={18} /> Dashboard
          </Link>
        )}

        {user && (
          <Link
            to="/admin/alunos"
            className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={isActive('/admin/alunos') ? { backgroundColor: colors.primary, color: colors.buttonActiveText } : { color: colors.text }}
            onClick={closeMobileMenu}
          >
            <Smile size={18} /> Alunos / Pacientes
          </Link>
        )}
        {user && (
          <Link
            to="/admin/instrutores"
            className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={isActive('/admin/instrutores') ? { backgroundColor: colors.primary, color: colors.buttonActiveText } : { color: colors.text }}
            onClick={closeMobileMenu}
          >
            <BookOpen size={18} /> Instrutores
          </Link>
        )}
        

        {user && role === 'admin' && (
          <Link
            to="/admin/usuarios"
            className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={isActive('/admin/usuarios') ? { backgroundColor: colors.primary, color: colors.buttonActiveText } : { color: colors.text }}
            onClick={closeMobileMenu}
          >
            <User size={18} /> Usuários
          </Link>
        )}

        {user && role === 'admin' && (
          <Link
            to="/admin/pagamentos"
            className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={isActive('/admin/pagamentos') ? { backgroundColor: colors.primary, color: colors.buttonActiveText } : { color: colors.text }}
            onClick={closeMobileMenu}
          >
            <CreditCard size={18} /> Pagamentos
          </Link>
        )}

         {user && role === 'admin' && (
           <Link
             to="/admin/relatorios"
             className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={isActive('/admin/relatorios') ? { backgroundColor: colors.primary, color: colors.buttonActiveText } : { color: colors.text }}
             onClick={closeMobileMenu}
           >
             <TrendingUp size={18} /> Relatórios
           </Link>
         )}

         {user && (
           <a
             href="/GUIA_USUARIO.md"
             target="_blank"
             rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={{ color: colors.text }}
             onClick={closeMobileMenu}
           >
             <HelpCircle size={18} /> Instruções de Uso
           </a>
         )}

        {!user && (
          <>
            <Link
              to="/admin/login"
              className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={isActive('/admin/login') ? { backgroundColor: colors.primary, color: colors.buttonActiveText } : { color: colors.text }}
              onClick={closeMobileMenu}
            >
              <LogIn size={18} /> Login
            </Link>
            <Link
              to="/admin/signup"
              className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={isActive('/admin/signup') ? { backgroundColor: colors.primary, color: colors.buttonActiveText } : { color: colors.text }}
              onClick={closeMobileMenu}
            >
              <UserPlus size={18} /> Criar usuário
            </Link>
          </>
        )}
      </div>

      {user && (
        <div className="pb-4">
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md"
            style={{ backgroundColor: 'transparent', color: colors.text }}
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary, color: colors.text }}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3" style={{ backgroundColor: colors.primary }}>
        <div className="font-extrabold text-white text-lg">Salus Pilates e Terapias</div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-white hover:bg-white/10"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={closeMobileMenu}
          />
          <div 
            className="absolute top-0 right-0 h-full w-64 flex flex-col"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="px-4 py-4 font-extrabold text-white text-lg border-b border-white/20">
              Menu
            </div>
            <nav className="px-2 py-2 space-y-1 text-sm flex-1 flex flex-col">
              <MenuItems />
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex h-screen sticky top-0 flex-col" style={{ width: 240, backgroundColor: colors.primary }}>
          <div className="px-4 py-4 font-extrabold text-white text-lg">Salus Pilates e Terapias</div>
          <nav className="px-2 py-2 space-y-1 text-sm flex-1 flex flex-col">
            <MenuItems />
          </nav>
        </aside>

        <main className="flex-1 px-4 md:px-6 py-4 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


