import { useEffect, useMemo, useState } from 'react';
import { db, getSecondaryAuth } from '../../firebase.js';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { Users, Shield, UserX } from 'react-feather';
import colors from '../../theme/colors.js';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'instrutor', label: 'Instrutor' },
];

const AdminUsers = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nome: '', cpf: '', email: '', telefone: '', perfil: 'instrutor' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('nome'));
    const unsub = onSnapshot(q, (snap) => {
      setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const createUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const secondaryAuth = getSecondaryAuth();
      const cred = await createUserWithEmailAndPassword(secondaryAuth, form.email, Math.random().toString(36).slice(2) + 'A1!');
      await setDoc(doc(db, 'users', cred.user.uid), {
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        telefone: form.telefone,
        role: form.perfil,
        active: true,
        createdAt: Date.now(),
      });
      await signOut(secondaryAuth);
      setForm({ nome: '', cpf: '', email: '', telefone: '', perfil: 'instrutor' });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u) => {
    await updateDoc(doc(db, 'users', u.id), { active: !u.active });
  };

  const makeAdmin = async (u) => {
    await updateDoc(doc(db, 'users', u.id), { role: 'admin' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users size={20} />
        <h2 className="text-xl font-bold">Usuários</h2>
      </div>

      <form onSubmit={createUser} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="rounded px-3 py-2" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }} />
        <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF" className="rounded px-3 py-2" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }} />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="rounded px-3 py-2" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }} />
        <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" className="rounded px-3 py-2" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }} />
        <select name="perfil" value={form.perfil} onChange={handleChange} className="rounded px-3 py-2" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }}>
          {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <button disabled={saving} className="rounded px-3 py-2 font-semibold" style={{ backgroundColor: colors.buttonActiveBg, border: `1px solid ${colors.border}`, color: colors.buttonActiveText }}>Cadastrar</button>
      </form>

      <div className="rounded p-4" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-left text-sm" style={{ color: colors.text }}>
              <thead>
                <tr style={{ color: '#cdd4e2' }}>
                  <th className="py-2">Nome</th>
                  <th className="py-2">CPF</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Telefone</th>
                  <th className="py-2">Perfil</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {list.map(u => (
                  <tr key={u.id} className="border-t" style={{ borderColor: colors.border }}>
                    <td className="py-2">{u.nome}</td>
                    <td className="py-2">{u.cpf}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{u.telefone}</td>
                    <td className="py-2">{u.role}</td>
                    <td className="py-2">{u.active ? 'Ativo' : 'Inativo'}</td>
                    <td className="py-2 flex gap-2">
                      <button onClick={() => toggleActive(u)} className="px-3 py-1 rounded" style={{ backgroundColor: u.active ? '#ff6b6b' : colors.buttonActiveBg, color: colors.buttonActiveText }}>{u.active ? 'Revogar' : 'Ativar'}</button>
                      {u.role !== 'admin' && (
                        <button onClick={() => makeAdmin(u)} className="px-3 py-1 rounded border" style={{ borderColor: colors.border, color: colors.buttonInactiveText }}>
                          <Shield size={14} className="inline-block mr-1" /> Tornar admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;


