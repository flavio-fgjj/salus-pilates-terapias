import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { Eye, EyeOff } from 'react-feather';
import { db } from '../../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { useUserStore } from '../../store/useUserStore.js';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Persistência: manter conectado => local; caso contrário => session
      await setPersistence(
        auth,
        staySignedIn ? browserLocalPersistence : browserSessionPersistence
      );
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Buscar perfil do Firestore e salvar no store
      const uid = cred.user?.uid;
      if (uid) {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;
        const setUserBasics = useUserStore.getState().setUserBasics;
        const setProfile = useUserStore.getState().setProfile;
        
        setUserBasics({ userId: uid, email: cred.user.email || null });
        setProfile({ role: data?.role || null, profile: data || null });
      }
      navigate('/admin/dashboard');
    } catch (err) {
      console.log('err -->', err);
      setError('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="max-w-sm mx-auto rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#2a2a40', color: '#e6e6f0' }}>
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <p className="text-sm mb-4" style={{ color: '#cdd4e2' }}>Acesso à área administrativa</p>
      {error && <div className="text-sm mb-3" style={{ color: '#ff6b6b' }}>{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
        </div>
        <div>
          <label className="text-sm">Senha</label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded px-3 py-2 pr-10"
              style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
            />
            <div
              onClick={() => setShowPassword((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white cursor-pointer select-none"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm" style={{ color: '#cdd4e2' }}>
          <input
            type="checkbox"
            checked={staySignedIn}
            onChange={(e) => setStaySignedIn(e.target.checked)}
          />
          Mantenha-me conectado
        </label>
        <button type="submit" className="w-full font-semibold rounded px-3 py-2" style={{ backgroundColor: '#1d8cf8', color: '#fff', border: '1px solid #1d8cf8' }}>Entrar</button>
        <div className="text-sm text-right">
          <Link to="/admin/forgot" className="underline" style={{ color: '#1d8cf8' }}>Esqueci minha senha</Link>
        </div>
      </form>
      <div className="text-sm mt-3">
        Não tem conta? <Link to="/admin/signup" className="underline" style={{ color: '#1d8cf8' }}>Criar usuário</Link>
      </div>
    </div>
  );
};

export default AdminLogin;


