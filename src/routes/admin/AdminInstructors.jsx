import { useEffect, useMemo, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { Users, MapPin } from 'react-feather';

const allDisciplines = [
  'Pilates', 'Ballet Infantil', 'Jiu-Jitsu', 'Acupuntura', 'Massagem', 'Quiropraxia', 'Reiki', 'Auriculoterapia ', 'Cone Hindu / Chines', 'Yoga'
];

const AdminInstructors = () => {
  const [list, setList] = useState([]);
  const [term, setTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    disciplinas: [],
  });
  const [activeTab, setActiveTab] = useState('pessoais');
  const tabsOrder = ['pessoais', 'endereco', 'disciplinas'];
  const handleTabsKeyDown = (e) => {
    const idx = tabsOrder.indexOf(activeTab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveTab(tabsOrder[(idx + 1) % tabsOrder.length]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveTab(tabsOrder[(idx - 1 + tabsOrder.length) % tabsOrder.length]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab(tabsOrder[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab(tabsOrder[tabsOrder.length - 1]);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'instructors'), orderBy('nome'));
    const unsub = onSnapshot(q, (snap) => {
      setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    return list.filter((i) => {
      const activeOk = showInactive ? true : i.active !== false;
      if (!activeOk) return false;
      if (!t) return true;
      const hay = `${i.nome || ''} ${i.email || ''} ${i.telefone || ''} ${(i.disciplinas || []).join(' ')}`.toLowerCase();
      return hay.includes(t);
    });
  }, [list, term, showInactive]);

  const formatCEP = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 8);
    return digits.replace(/(\d{5})(\d)/, '$1-$2');
  };
  const formatPhone = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === 'cep') next = formatCEP(value);
    if (name === 'telefone') next = formatPhone(value);
    setForm((prev) => ({ ...prev, [name]: next }));
  };

  const toggleDisciplina = (d) => {
    setForm((prev) => ({
      ...prev,
      disciplinas: prev.disciplinas.includes(d) ? prev.disciplinas.filter((x) => x !== d) : [...prev.disciplinas, d],
    }));
  };

  const buscarCEP = async (cep) => {
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setForm((prev) => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          }));
        }
      } catch {}
    }
  };

  const startNew = () => {
    setEditingId(null);
    setForm({ nome: '', email: '', telefone: '', cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', disciplinas: [] });
    setShowFormModal(true);
    setActiveTab('pessoais');
  };
  const startEdit = (i) => {
    setEditingId(i.id);
    setForm({ nome: i.nome || '', email: i.email || '', telefone: i.telefone || '', cep: i.cep || '', logradouro: i.logradouro || '', numero: i.numero || '', complemento: i.complemento || '', bairro: i.bairro || '', cidade: i.cidade || '', estado: i.estado || '', disciplinas: i.disciplinas || [] });
    setShowFormModal(true);
    setActiveTab('pessoais');
  };

  const softDelete = async (i) => {
    await updateDoc(doc(db, 'instructors', i.id), { active: false, deletedAt: Date.now() });
  };
  const restore = async (i) => {
    await updateDoc(doc(db, 'instructors', i.id), { active: true, deletedAt: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editingId) {
        await updateDoc(doc(db, 'instructors', editingId), { ...form, updatedAt: Date.now() });
      } else {
        await addDoc(collection(db, 'instructors'), { ...form, active: true, createdAt: Date.now() });
      }
      setShowFormModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users size={20} />
        <h2 className="text-xl font-bold">Instrutores</h2>
      </div>

      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Buscar por nome, email, telefone, disciplina" className="flex-1 rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
          <label className="flex items-center gap-2 text-sm" style={{ color: '#cdd4e2' }}>
            <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} /> Mostrar inativos
          </label>
          <button type="button" onClick={startNew} className="px-3 py-2 rounded font-semibold" style={{ backgroundColor: '#1d8cf8', color: '#fff', border: '1px solid #1d8cf8' }}>Novo instrutor</button>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm" style={{ color: '#e6e6f0' }}>
            <thead style={{ color: '#cdd4e2' }}>
              <tr>
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Telefone</th>
                <th className="text-left py-2">Disciplinas</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-t" style={{ borderColor: '#1d8cf8' }}>
                  <td className="py-2">{i.nome}</td>
                  <td className="py-2">{i.email}</td>
                  <td className="py-2">{i.telefone}</td>
                  <td className="py-2">{(i.disciplinas || []).join(', ')}</td>
                  <td className="py-2">{i.active === false ? 'Inativo' : 'Ativo'}</td>
                  <td className="py-2 flex gap-2">
                    <button onClick={() => startEdit(i)} className="px-2 py-1 rounded border" style={{ borderColor: '#1d8cf8', color: '#1d8cf8' }}>Editar</button>
                    {i.active === false ? (
                      <button onClick={() => restore(i)} className="px-2 py-1 rounded border" style={{ borderColor: '#22c55e', color: '#22c55e' }}>Restaurar</button>
                    ) : (
                      <button onClick={() => softDelete(i)} className="px-2 py-1 rounded border" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Inativar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

             {showFormModal && (
               <div className="fixed inset-0 z-50">
                 <div className="absolute inset-0 bg-black/50" onClick={() => setShowFormModal(false)} />
                 <div className="absolute inset-x-0 top-2 mx-auto max-w-3xl w-full rounded-lg p-4 space-y-4" style={{ backgroundColor: '#1f2437', border: '1px solid #1d8cf8' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: '#e6e6f0' }}>{editingId ? 'Editar Instrutor' : 'Novo Instrutor'}</h3>
              <button onClick={() => setShowFormModal(false)} className="px-3 py-1 rounded border" style={{ borderColor: '#1d8cf8', color: '#1d8cf8' }}>Fechar</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2 flex-wrap" role="tablist" onKeyDown={(e) => {
                const order = ['pessoais','endereco','disciplinas'];
                const idx = order.indexOf(activeTab);
                if (e.key === 'ArrowRight') { e.preventDefault(); setActiveTab(order[(idx+1)%order.length]); }
                if (e.key === 'ArrowLeft') { e.preventDefault(); setActiveTab(order[(idx-1+order.length)%order.length]); }
                if (e.key === 'Home') { e.preventDefault(); setActiveTab(order[0]); }
                if (e.key === 'End') { e.preventDefault(); setActiveTab(order[order.length-1]); }
              }} tabIndex={0}>
                <button type="button" role="tab" aria-selected={activeTab === 'pessoais'} onClick={() => setActiveTab('pessoais')} className="px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1d8cf8]" style={activeTab === 'pessoais' ? { backgroundColor: '#1d8cf8', color: '#0b1324' } : { backgroundColor: '#2a2a40', color: '#e6e6f0', border: '1px solid #1d8cf8' }}>Dados pessoais</button>
                <button type="button" role="tab" aria-selected={activeTab === 'endereco'} onClick={() => setActiveTab('endereco')} className="px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1d8cf8]" style={activeTab === 'endereco' ? { backgroundColor: '#1d8cf8', color: '#0b1324' } : { backgroundColor: '#2a2a40', color: '#e6e6f0', border: '1px solid #1d8cf8' }}>Endereço</button>
                <button type="button" role="tab" aria-selected={activeTab === 'disciplinas'} onClick={() => setActiveTab('disciplinas')} className="px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1d8cf8]" style={activeTab === 'disciplinas' ? { backgroundColor: '#1d8cf8', color: '#0b1324' } : { backgroundColor: '#2a2a40', color: '#e6e6f0', border: '1px solid #1d8cf8' }}>Disciplinas</button>
              </div>

                     {activeTab === 'pessoais' && (
                       <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
                         <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm block mb-1">Nome completo</label>
                      <input name="nome" value={form.nome} onChange={handleChange} className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
                    </div>
                    <div>
                      <label className="text-sm block mb-1">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
                    </div>
                    <div>
                      <label className="text-sm block mb-1">Telefone</label>
                      <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999" className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
                    </div>
                  </div>
                </div>
              )}

                     {activeTab === 'endereco' && (
                       <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
                         <h4 className="text-sm font-semibold mb-3">Endereço</h4>
                         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm block mb-1">CEP</label>
                      <input name="cep" value={form.cep} onChange={(e) => { handleChange(e); buscarCEP(e.target.value.replace(/\D/g, '')); }} placeholder="00000-000" maxLength={9} className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="text-sm block mb-1">Logradouro</label>
                      <input name="logradouro" value={form.logradouro} onChange={handleChange} className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
                    </div>
                    <div>
                      <label className="text-sm block mb-1">Número</label>
                      <input name="numero" value={form.numero} onChange={handleChange} className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
                    </div>
                    <div>
                      <label className="text-sm block mb-1">Complemento</label>
                      <input name="complemento" value={form.complemento} onChange={handleChange} className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
                    </div>
                    <div>
                      <label className="text-sm block mb-1">Bairro</label>
                      <input name="bairro" value={form.bairro} onChange={handleChange} className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
                    </div>
                    <div>
                      <label className="text-sm block mb-1">Cidade</label>
                      <input name="cidade" value={form.cidade} onChange={handleChange} className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
                    </div>
                    <div>
                      <label className="text-sm block mb-1">Estado</label>
                      <input name="estado" value={form.estado} onChange={handleChange} maxLength={2} className="w-full rounded px-3 py-2" style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }} />
                    </div>
                  </div>
                </div>
              )}

                     {activeTab === 'disciplinas' && (
                       <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
                         <h4 className="text-sm font-semibold mb-3">Disciplinas</h4>
                  <div className="flex flex-wrap gap-2">
                    {allDisciplines.map((d) => (
                      <button key={d} type="button" onClick={() => toggleDisciplina(d)} className="px-3 py-1.5 rounded text-sm"
                        style={form.disciplinas.includes(d) ? { backgroundColor: '#1d8cf8', color: '#0b1324' } : { backgroundColor: '#1e1e2f', color: '#e6e6f0', border: '1px solid #1d8cf8' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {message && (
                <div className={`text-sm p-3 rounded ${message.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>{message}</div>
              )}

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-3 py-2 rounded border" style={{ borderColor: '#1d8cf8', color: '#1d8cf8' }}>Cancelar</button>
                <button type="submit" disabled={loading} className="px-3 py-2 rounded" style={{ backgroundColor: '#1d8cf8', color: '#fff', border: '1px solid #1d8cf8' }}>{loading ? (editingId ? 'Salvando...' : 'Cadastrando...') : (editingId ? 'Salvar' : 'Cadastrar')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstructors;


