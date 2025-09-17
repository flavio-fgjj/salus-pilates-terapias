import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.js';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha email e senha.');
      return;
    }
    if (password !== confirm) {
      setError('Senhas não conferem.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/admin/login');
    } catch (err) {
      setError('Falha ao criar usuário.');
    }
  };

  return (
    <div className="max-w-sm mx-auto rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#2a2a40', color: '#e6e6f0' }}>
      <h2 className="text-xl font-bold mb-2">Criar usuário</h2>
      <p className="text-sm mb-4" style={{ color: '#cdd4e2' }}>Cadastro para acesso administrativo</p>
      {error && <div className="text-sm mb-3" style={{ color: '#ff6b6b' }}>{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
        </div>
        <div>
          <label className="text-sm">Senha</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
        </div>
        <div>
          <label className="text-sm">Confirmar senha</label>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
        </div>
        <button type="submit" className="w-full font-semibold rounded px-3 py-2" style={{ backgroundColor: '#1d8cf8', color: '#fff', border: '1px solid #1d8cf8' }}>Criar</button>
      </form>
      <div className="text-sm mt-3">
        Já tem conta? <Link to="/admin/login" className="underline" style={{ color: '#1d8cf8' }}>Entrar</Link>
      </div>
    </div>
  );
};

export default AdminSignup;


