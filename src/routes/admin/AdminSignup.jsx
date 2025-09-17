import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase.js';
import { doc, setDoc } from 'firebase/firestore';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [error, setError] = useState('');

  const formatCPF = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !nome || !cpf || !telefone) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (password !== confirm) {
      setError('Senhas não conferem.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Criar documento na collection users
      await setDoc(doc(db, 'users', user.uid), {
        nome,
        cpf,
        telefone,
        email,
        role: 'instrutor',
        active: 'pending',
        createdAt: Date.now(),
      });
      
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
          <label className="text-sm">Nome completo *</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} type="text" className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
        </div>
        <div>
          <label className="text-sm">CPF *</label>
          <input value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} type="text" placeholder="000.000.000-00" className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
        </div>
        <div>
          <label className="text-sm">Telefone *</label>
          <input value={telefone} onChange={(e) => setTelefone(formatPhone(e.target.value))} type="text" placeholder="(11) 99999-9999" className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
        </div>
        <div>
          <label className="text-sm">Email *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
        </div>
        <div>
          <label className="text-sm">Senha *</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
        </div>
        <div>
          <label className="text-sm">Confirmar senha *</label>
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


