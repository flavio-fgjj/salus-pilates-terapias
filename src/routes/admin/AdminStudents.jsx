import { useEffect, useMemo, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { Users, MapPin, Calendar, CreditCard } from 'react-feather';

const disciplines = [
  { value: 'pilates', label: 'Pilates' },
  { value: 'ballet', label: 'Ballet Infantil' },
  { value: 'jiu-jitsu', label: 'Jiu-Jitsu' },
  { value: 'acupuntura', label: 'Acupuntura' },
  { value: 'massagem', label: 'Massagem' },
  { value: 'quiropraxia', label: 'Quiropraxia' },
  { value: 'reiki', label: 'Reiki' },
];

const paymentMethods = [
  { value: 'pix', label: 'PIX' },
  { value: 'cartao', label: 'Cartão de Crédito' },
  { value: 'debito', label: 'Cartão de Débito' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'transferencia', label: 'Transferência' },
];

const AdminStudents = () => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    documento: '',
    disciplina: '',
    responsavel: '',
    telefoneResponsavel: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    optinInstagram: false,
    formaPagamento: '',
    dataVencimento: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [list, setList] = useState([]);
  const [term, setTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('pessoais');

  const tabsOrder = ['pessoais', 'responsavel', 'endereco', 'config'];
  const handleTabsKeyDown = (e) => {
    const idx = tabsOrder.indexOf(activeTab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const ni = (idx + 1) % tabsOrder.length;
      setActiveTab(tabsOrder[ni]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const ni = (idx - 1 + tabsOrder.length) % tabsOrder.length;
      setActiveTab(tabsOrder[ni]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab(tabsOrder[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab(tabsOrder[tabsOrder.length - 1]);
    }
  };

  const openPrint = (html, title = 'Documento') => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8" /><title>${title}</title><style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial; color: #0f172a; }
      .container { max-width: 800px; margin: 0 auto; padding: 24px; }
      h1 { font-size: 22px; margin-bottom: 12px; }
      h2 { font-size: 16px; margin: 18px 0 8px; }
      p, li, td, th { font-size: 14px; line-height: 1.5; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
      .muted { color: #475569; }
      .signature { margin-top: 48px; display:flex; gap:32px; }
      .signature > div { flex:1; }
      .line { border-top: 1px solid #0f172a; margin-top: 48px; }
      @media print { .no-print { display: none; } }
    </style></head><body><div class="container">${html}</div></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const buildAddress = () => {
    const parts = [form.logradouro, form.numero, form.complemento, form.bairro, form.cidade && `${form.cidade}/${form.estado}`, form.cep];
    return parts.filter(Boolean).join(', ');
  };

  const printContract = () => {
    const enderecoEmpresa = 'Avenida Presidente Kennedy, 11862, Vila Caiçara, Praia Grande/SP, CEP: 11705-750';
    const html = `
      <div style=\"display:flex; align-items:center; gap:16px; margin-bottom:16px;\">\n\
        <img src=\"/assets/logo.png\" alt=\"Salus\" style=\"height:56px;\"/>\n\
        <div>\n\
          <h1 style=\"margin:0;\">CONTRATO DE PRESTAÇÃO DE SERVIÇOS AO CLIENTE</h1>\n\
          <p class=\"muted\" style=\"margin:2px 0 0;\">Data: ${new Date().toLocaleDateString('pt-BR')}</p>\n\
        </div>\n\
      </div>

      <h2>Contratado</h2>
      <p><strong>Espaço Salus - Pilates e Terapias</strong>, CNPJ nº 30.074.747/878-? (ajustar), nome fantasia: Espaço Salus - Pilates e Terapias, com sede em ${enderecoEmpresa}.</p>

      <h2>Contratante</h2>
      <table>
        <tr><th>Nome</th><td>${form.nome || '__________________________________________'}</td></tr>
        <tr><th>CPF/RG</th><td>${form.documento || '__________________ / ______________'}</td></tr>
        <tr><th>Endereço</th><td>${buildAddress() || '____________________________________________'}</td></tr>
      </table>

      <h2>Cláusula 1: Serviços</h2>
      <p>O Contratado compromete-se a ministrar/executar:</p>
      <table>
        <tr><td>${form.disciplina || '____________________________________________________'}</td></tr>
        <tr><td>____________________________________________________</td></tr>
        <tr><td>____________________________________________________</td></tr>
      </table>

      <h2>Cláusula 2: Horários</h2>
      <p>O Contratante e o Contratado deverão estar prontos no local das aulas, para que não haja atrasos no horário estabelecido.</p>
      <p><em>Parágrafo único:</em> A aula terá cinquenta minutos de duração. Caso o aluno atrase, seu horário já estará sendo contado, para não prejudicar a aula seguinte.</p>

      <h2>Cláusula 3: Reposição de aulas</h2>
      <p>Só serão substituídas as aulas com aviso prévio de até 3 (três) horas. Aulas de reposição serão marcadas em dias e horários a serem combinados, dentro do mês equivalente.</p>

      <h2>Cláusula 4</h2>
      <p>Caso a(o) Contratada falte, deverá repor, não causando prejuízo ao aluno.</p>

      <h2>Cláusula 5</h2>
      <p>As aulas são intransferíveis. Realizado o total de aulas pelo Contratante, estas não poderão ser realizadas por outra pessoa. A aula será de no máximo 6 alunos, dependendo do horário.</p>

      <h2>Cláusula 6: Recesso</h2>
      <p>Na semana de Natal e na semana de Ano Novo o Studio entra em recesso, sendo a mensalidade paga integralmente, sem reposições, para garantir o horário do Contratante.</p>

      <h2>Cláusula 7: Pagamento, planos e valores</h2>
      <p>Opções de atividades: ( ) PILATES | ( ) BALLET INFANTIL | ( ) DANÇA | ( ) MEDICINA CHINESA | ( ) QUIROPRAXIA SEITAI | ( ) REIKI | ( ) MASSAGEM | ( ) RADIESTESIA TERAPÊUTICA | ( ) CONE HINDU | ( ) ACUPUNTURA ESTÉTICA</p>
      <p>O pagamento será feito todo dia ______ de cada mês.</p>
      <table>
        <tr><th>Frequência</th><th>Valor</th></tr>
        <tr><td>1x por semana</td><td>________________</td></tr>
        <tr><td>2x por semana</td><td>________________</td></tr>
        <tr><td>3x por semana</td><td>________________</td></tr>
        <tr><td>4x por semana</td><td>________________</td></tr>
        <tr><td>5x por semana</td><td>________________</td></tr>
        <tr><td>Aula/Sessão avulsa</td><td>________________</td></tr>
      </table>

      <h2>Cláusula 8: Atraso das mensalidades</h2>
      <p>Em caso de atraso, multa moratória de 2% sobre o valor devido e juros de 1% a.m. pro rata die. Aulas serão suspensas até a regularização, sem direito a reposição.</p>

      <h2>Cláusula 9: Renovação</h2>
      <p>Este contrato poderá ser renovado automaticamente mediante pagamento do mês seguinte, conforme Cláusula 7.</p>

      <h2>Cláusula 10: Valores promocionais</h2>
      <p>Valores promocionais podem ser reajustados a qualquer momento, mediante comunicação com 15 dias de antecedência, podendo o Contratante optar por continuar ou rescindir sem ônus adicional.</p>

      <h2>Cláusula 11: Rescisão</h2>
      <p>Poderá ser cancelado pelo Contratante a qualquer momento, mediante aviso por escrito com 30 dias de antecedência.</p>

      <h2>Cláusula 12: Inadimplência</h2>
      <p>O não pagamento sujeita o Contratante às medidas legais cabíveis.</p>

      <h2>Cláusula 13: Foro</h2>
      <p>Fica eleito o foro da Comarca de Praia Grande/SP, com exclusão de qualquer outro.</p>

      <p class=\"muted\">E por estarem de acordo, firmam o presente instrumento em 2 (duas) vias de igual teor e forma, juntamente com as testemunhas abaixo.</p>

      <div class=\"signature\">\n\
        <div>\n\
          <div class=\"line\"></div>\n\
          <p>CONTRATANTE</p>\n\
        </div>\n\
        <div>\n\
          <div class=\"line\"></div>\n\
          <p>CONTRATADO</p>\n\
        </div>\n\
      </div>
    `;
    openPrint(html, 'Contrato');
  };

  const printImageConsent = () => {
    const enderecoEmpresa = 'Avenida Presidente Kennedy, 11862 - Vila Caiçara, Praia Grande - SP';
    const html = `
      <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">
        <img src="/assets/logo.png" alt="Salus" style="height:56px;"/>
        <div>
          <h1 style="margin:0;">TERMO DE AUTORIZAÇÃO DE USO DA IMAGEM</h1>
          <p class="muted" style="margin:2px 0 0;">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
      <p>Eu, <strong>${form.nome || '____________________________________'}</strong>,
      <span class="muted">________________ (estado civil), ________________ (profissão),</span>
      portador(a) do RG nº <strong>${form.documento || '________________'}</strong>, inscrito(a) no CPF/MF sob nº <strong>${form.documento || '________________'}</strong>,
      residente à <strong>${buildAddress() || '____________________________________________'}</strong>,
      AUTORIZO o uso de minha imagem em todo e qualquer material entre fotos, vídeos, exames e outros meios de comunicação, para ser utilizada pelo Espaço Salus, situado em ${enderecoEmpresa},
      para divulgação ao público em geral e/ou uso interno (quando se tratar de exames), desde que não haja desvirtuamento da finalidade.</p>

      <p>A presente autorização é concedida a título gratuito, abrangendo o uso da imagem acima mencionada em todo território nacional e no exterior, em todas as suas modalidades, incluindo, sem se limitar a:
      (I) folhetos em geral (encartes, mala direta, catálogo etc.); (II) folder de apresentação; (III) anúncios em revistas e jornais; (IV) website e redes sociais; (V) cartazes; (VI) mídia eletrônica e apresentações públicas (painéis, vídeos, televisão, data show, cinema, rádio, entre outros).</p>

      <p>Declaro estar ciente de que esta autorização é ${form.optinInstagram ? '<strong>concedida</strong>' : '<strong>pendente (marcar no cadastro)</strong>'} e poderá ser revogada a qualquer tempo mediante solicitação formal.</p>

      <h2>Dados para conferência</h2>
      <table>
        <tr><th>Aluno</th><td>${form.nome || '-'}</td></tr>
        <tr><th>Responsável</th><td>${form.responsavel || '-'}</td></tr>
        <tr><th>Telefone</th><td>${form.telefone || form.telefoneResponsavel || '-'}</td></tr>
        <tr><th>Disciplina</th><td>${form.disciplina || '-'}</td></tr>
      </table>

      <div class="signature">
        <div>
          <div class="line"></div>
          <p>Assinatura do Aluno/Responsável</p>
        </div>
        <div>
          <div class="line"></div>
          <p>Assinatura do Espaço Salus</p>
        </div>
      </div>
    `;
    openPrint(html, 'Termo de Uso de Imagem');
  };

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

  const formatCEP = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 8);
    return digits.replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let next = value;
    if (name === 'documento') next = formatCPF(value);
    if (name === 'telefone' || name === 'telefoneResponsavel') next = formatPhone(value);
    if (name === 'cep') next = formatCEP(value);
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : next }));
  };

  const calcAge = (isoDate) => {
    if (!isoDate) return null;
    const d = new Date(isoDate);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  const validateForm = () => {
    const errs = {};
    if (!form.nome.trim()) errs.nome = 'Informe o nome';
    if (!form.disciplina) errs.disciplina = 'Selecione a disciplina';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Email inválido';
    if (form.cep && form.cep.replace(/\D/g, '').length !== 8) errs.cep = 'CEP inválido';
    const age = calcAge(form.dataNascimento);
    if (age !== null && age < 18) {
      if (!form.responsavel.trim()) errs.responsavel = 'Obrigatório para menor';
      if (!form.telefoneResponsavel.trim()) errs.telefoneResponsavel = 'Obrigatório para menor';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buscarCEP = async (cep) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setForm(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      if (editingId) {
        await updateDoc(doc(db, 'students', editingId), {
          ...form,
          updatedAt: Date.now(),
        });
        setMessage('Aluno atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'students'), {
          ...form,
          createdAt: Date.now(),
          active: true,
        });
        setMessage('Aluno cadastrado com sucesso!');
      }
      setEditingId(null);
      setForm({
        nome: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        documento: '',
        disciplina: '',
        responsavel: '',
        telefoneResponsavel: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        optinInstagram: false,
        formaPagamento: '',
        dataVencimento: '',
      });
    } catch (error) {
      setMessage('Erro ao cadastrar aluno. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Listagem em tempo real
  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('nome'));
    const unsub = onSnapshot(q, (snap) => {
      setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    return list.filter((s) => {
      const activeOk = showInactive ? true : s.active !== false;
      if (!activeOk) return false;
      if (!t) return true;
      const hay = `${s.nome || ''} ${s.email || ''} ${s.telefone || ''} ${s.disciplina || ''}`.toLowerCase();
      return hay.includes(t);
    });
  }, [list, term, showInactive]);

  const startEdit = (student) => {
    setEditingId(student.id);
    setForm({
      nome: student.nome || '',
      email: student.email || '',
      telefone: student.telefone || '',
      dataNascimento: student.dataNascimento || '',
      documento: student.documento || '',
      disciplina: student.disciplina || '',
      responsavel: student.responsavel || '',
      telefoneResponsavel: student.telefoneResponsavel || '',
      cep: student.cep || '',
      logradouro: student.logradouro || '',
      numero: student.numero || '',
      complemento: student.complemento || '',
      bairro: student.bairro || '',
      cidade: student.cidade || '',
      estado: student.estado || '',
      optinInstagram: Boolean(student.optinInstagram),
      formaPagamento: student.formaPagamento || '',
      dataVencimento: student.dataVencimento || '',
    });
    setShowFormModal(true);
  };

  const newStudent = () => {
    setEditingId(null);
    setForm({
      nome: '', email: '', telefone: '', dataNascimento: '', documento: '', disciplina: '',
      responsavel: '', telefoneResponsavel: '', cep: '', logradouro: '', numero: '', complemento: '',
      bairro: '', cidade: '', estado: '', optinInstagram: false, formaPagamento: '', dataVencimento: '',
    });
    setShowFormModal(true);
  };

  const softDelete = async (student) => {
    await updateDoc(doc(db, 'students', student.id), { active: false, deletedAt: Date.now() });
  };

  const restore = async (student) => {
    await updateDoc(doc(db, 'students', student.id), { active: true, deletedAt: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users size={20} />
        <h2 className="text-xl font-bold">Cadastro de Alunos</h2>
      </div>

      {/* Listagem e Busca */}
      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar por nome, email, telefone, disciplina"
            className="flex-1 rounded px-3 py-2"
            style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
          />
          <label className="flex items-center gap-2 text-sm" style={{ color: '#cdd4e2' }}>
            <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
            Mostrar inativos
          </label>
          <button type="button" onClick={newStudent} className="px-3 py-2 rounded font-semibold" style={{ backgroundColor: '#1d8cf8', color: '#fff', border: '1px solid #1d8cf8' }}>
            Novo aluno
          </button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm" style={{ color: '#e6e6f0' }}>
            <thead style={{ color: '#cdd4e2' }}>
              <tr>
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Telefone</th>
                <th className="text-left py-2">Disciplina</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t" style={{ borderColor: '#1d8cf8' }}>
                  <td className="py-2">{s.nome}</td>
                  <td className="py-2">{s.email}</td>
                  <td className="py-2">{s.telefone}</td>
                  <td className="py-2">{s.disciplina}</td>
                  <td className="py-2">{s.active === false ? 'Inativo' : 'Ativo'}</td>
                  <td className="py-2 flex gap-2">
                    <button onClick={() => startEdit(s)} className="px-2 py-1 rounded border" style={{ borderColor: '#1d8cf8', color: '#1d8cf8' }}>Editar</button>
                    {s.active === false ? (
                      <button onClick={() => restore(s)} className="px-2 py-1 rounded border" style={{ borderColor: '#22c55e', color: '#22c55e' }}>Restaurar</button>
                    ) : (
                      <button onClick={() => softDelete(s)} className="px-2 py-1 rounded border" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Inativar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulário em Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFormModal(false)} />
          <div className="absolute inset-x-0 top-6 mx-auto max-w-4xl w-full rounded-lg p-6 space-y-6" style={{ backgroundColor: '#1f2437', border: '1px solid #1d8cf8' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#e6e6f0' }}>
                <Users size={18} /> {editingId ? 'Editar Aluno' : 'Novo Aluno'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="px-3 py-1 rounded border" style={{ borderColor: '#1d8cf8', color: '#1d8cf8' }}>Fechar</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Abas */}
              <div className="flex gap-2 flex-wrap" role="tablist" onKeyDown={handleTabsKeyDown} tabIndex={0}>
                <button type="button" role="tab" aria-selected={activeTab === 'pessoais'} onClick={() => setActiveTab('pessoais')} className="px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1d8cf8]" style={activeTab === 'pessoais' ? { backgroundColor: '#1d8cf8', color: '#0b1324' } : { backgroundColor: '#2a2a40', color: '#e6e6f0', border: '1px solid #1d8cf8' }}>Dados pessoais</button>
                <button type="button" role="tab" aria-selected={activeTab === 'responsavel'} onClick={() => setActiveTab('responsavel')} className="px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1d8cf8]" style={activeTab === 'responsavel' ? { backgroundColor: '#1d8cf8', color: '#0b1324' } : { backgroundColor: '#2a2a40', color: '#e6e6f0', border: '1px solid #1d8cf8' }}>Responsável</button>
                <button type="button" role="tab" aria-selected={activeTab === 'endereco'} onClick={() => setActiveTab('endereco')} className="px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1d8cf8]" style={activeTab === 'endereco' ? { backgroundColor: '#1d8cf8', color: '#0b1324' } : { backgroundColor: '#2a2a40', color: '#e6e6f0', border: '1px solid #1d8cf8' }}>Endereço</button>
                <button type="button" role="tab" aria-selected={activeTab === 'config'} onClick={() => setActiveTab('config')} className="px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1d8cf8]" style={activeTab === 'config' ? { backgroundColor: '#1d8cf8', color: '#0b1324' } : { backgroundColor: '#2a2a40', color: '#e6e6f0', border: '1px solid #1d8cf8' }}>Configurações</button>
              </div>
              {/* Dados Pessoais */}
              {activeTab === 'pessoais' && (
              <div className="rounded-lg p-6" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users size={18} />Dados Pessoais</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm block mb-1">Nome Completo *</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
              {errors.nome && <div className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.nome}</div>}
            </div>
            <div>
              <label className="text-sm block mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
              {errors.email && <div className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.email}</div>}
            </div>
            <div>
              <label className="text-sm block mb-1">Telefone</label>
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Data de Nascimento</label>
              <input
                name="dataNascimento"
                type="date"
                value={form.dataNascimento}
                onChange={handleChange}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
              {(() => { const age = calcAge(form.dataNascimento); return age !== null ? (
                <div className="text-xs mt-1" style={{ color: '#cdd4e2' }}>
                  Idade: {age} {age === 1 ? 'ano' : 'anos'}
                </div>
              ) : null; })()}
            </div>
            <div>
              <label className="text-sm block mb-1">Documento (CPF/RG)</label>
              <input
                name="documento"
                value={form.documento}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Disciplina *</label>
              <select
                name="disciplina"
                value={form.disciplina}
                onChange={handleChange}
                required
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              >
                <option value="">Selecione uma disciplina</option>
                {disciplines.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              {errors.disciplina && <div className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.disciplina}</div>}
            </div>
          </div>
              </div>
              )}

              {/* Responsável */}
              {activeTab === 'responsavel' && (
              <div className="rounded-lg p-6" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
          <h3 className="text-lg font-semibold mb-4">Responsável (para menores)</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm block mb-1">Nome do Responsável</label>
              <input
                name="responsavel"
                value={form.responsavel}
                onChange={handleChange}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
              {errors.responsavel && <div className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.responsavel}</div>}
            </div>
            <div>
              <label className="text-sm block mb-1">Telefone do Responsável</label>
              <input
                name="telefoneResponsavel"
                value={form.telefoneResponsavel}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
              {errors.telefoneResponsavel && <div className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.telefoneResponsavel}</div>}
            </div>
          </div>
              </div>
              )}

              {/* Endereço */}
              {activeTab === 'endereco' && (
              <div className="rounded-lg p-6" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin size={18} />
            Endereço
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm block mb-1">CEP</label>
              <input
                name="cep"
                value={form.cep}
                onChange={(e) => {
                  handleChange(e);
                  buscarCEP(e.target.value.replace(/\D/g, ''));
                }}
                placeholder="00000-000"
                maxLength={9}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
              {errors.cep && <div className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.cep}</div>}
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm block mb-1">Logradouro</label>
              <input
                name="logradouro"
                value={form.logradouro}
                onChange={handleChange}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Número</label>
              <input
                name="numero"
                value={form.numero}
                onChange={handleChange}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Complemento</label>
              <input
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Bairro</label>
              <input
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Cidade</label>
              <input
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Estado</label>
              <input
                name="estado"
                value={form.estado}
                onChange={handleChange}
                maxLength={2}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
            </div>
          </div>
              </div>
              )}

              {/* Configurações */}
              {activeTab === 'config' && (
              <div className="rounded-lg p-6" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard size={18} />
            Configurações
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="optinInstagram"
                  type="checkbox"
                  checked={form.optinInstagram}
                  onChange={handleChange}
                />
                Autorizo o uso de fotos no Instagram da marca
              </label>
            </div>
            <div>
              <label className="text-sm block mb-1">Forma de Pagamento</label>
              <select
                name="formaPagamento"
                value={form.formaPagamento}
                onChange={handleChange}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              >
                <option value="">Selecione a forma de pagamento</option>
                {paymentMethods.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1">Data de Vencimento</label>
              <input
                name="dataVencimento"
                type="date"
                value={form.dataVencimento}
                onChange={handleChange}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
              />
            </div>
          </div>
              </div>
              )}

              {message && (
          <div className={`text-sm p-3 rounded ${message.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </div>
              )}

              <div className="grid sm:grid-cols-3 gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold rounded px-4 py-3"
                  style={{ backgroundColor: '#1d8cf8', color: '#fff', border: '1px solid #1d8cf8' }}
                >
                  {loading ? (editingId ? 'Salvando...' : 'Cadastrando...') : (editingId ? 'Salvar' : 'Cadastrar Aluno')}
                </button>
                <button
                  type="button"
                  onClick={printContract}
                  className="w-full font-semibold rounded px-4 py-3"
                  style={{ backgroundColor: '#2a2a40', color: '#1d8cf8', border: '1px solid #1d8cf8' }}
                >
                  Imprimir Contrato
                </button>
                <button
                  type="button"
                  onClick={printImageConsent}
                  className="w-full font-semibold rounded px-4 py-3"
                  style={{ backgroundColor: '#2a2a40', color: '#1d8cf8', border: '1px solid #1d8cf8' }}
                >
                  Imprimir Termo de Imagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
