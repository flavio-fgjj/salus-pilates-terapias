import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Calendar, Users, UserCheck, BookOpen, BarChart, Plus, X } from 'react-feather';
import { useUserStore } from '../../store/useUserStore.js';
import colors from '../../theme/colors.js';
import { db } from '../../firebase.js';
import { collection, addDoc, onSnapshot, query, where, doc } from 'firebase/firestore';
import { disciplines } from '../../data/disciplines.js';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const doLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const cards = [
    { title: 'Agenda', icon: Calendar, description: 'Gerenciar horários e agendamentos' },
    { title: 'Frequência', icon: UserCheck, description: 'Controle de presença dos alunos' },
    { title: 'Cadastrar Instrutores', icon: Users, description: 'Adicionar novos instrutores' },
    { title: 'Cadastrar Alunos/Pacientes', icon: BookOpen, description: 'Registrar novos alunos/pacientes' },
    { title: 'Relatórios', icon: BarChart, description: 'Visualizar dados e estatísticas' }
  ];

  const userStore = useUserStore();
  const storeRole = userStore?.role;
  const storeEmail = userStore?.email;
  const profile = userStore?.profile;

  // Agenda state
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ instructorId: '', studentIds: [], discipline: '', days: [], startTime: '10:00', endTime: '11:00', startDate: '', endDate: '' });
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [activeTab, setActiveTab] = useState('instructor');

  useEffect(() => {
    const unsubI = onSnapshot(query(collection(db, 'instructors'), where('active', 'in', [true, null])), (snap) => {
      setInstructors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubS = onSnapshot(query(collection(db, 'students'), where('active', 'in', [true, null])), (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubSch = onSnapshot(query(collection(db, 'schedules')), (snap) => {
      setSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubI(); unsubS(); unsubSch(); };
  }, []);

  const daysOfWeek = [
    { id: 0, label: 'Dom' },
    { id: 1, label: 'Seg' },
    { id: 2, label: 'Ter' },
    { id: 3, label: 'Qua' },
    { id: 4, label: 'Qui' },
    { id: 5, label: 'Sex' },
    { id: 6, label: 'Sáb' },
  ];

  const today = new Date();
  const todayDow = today.getDay();

  const isInRange = (dateISO, startISO, endISO) => {
    const d = new Date(dateISO);
    if (startISO && d < new Date(startISO)) return false;
    if (endISO && d > new Date(endISO)) return false;
    return true;
  };

  const getWeekDates = (baseDate) => {
    const d = new Date(baseDate);
    const day = d.getDay();
    const mondayDiff = (day === 0 ? -6 : 1) - day; // Monday as start
    const monday = new Date(d);
    monday.setDate(d.getDate() + mondayDiff);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const di = new Date(monday);
      di.setDate(monday.getDate() + i);
      days.push(di);
    }
    return days; // Mon..Sun
  };

  const weekDates = getWeekDates(today);

  const todaysItems = useMemo(() => {
    const instMap = Object.fromEntries(instructors.map(i => [i.id, i]));
    const studMap = Object.fromEntries(students.map(s => [s.id, s]));
    return schedules
      .filter(s => s.active !== false && Array.isArray(s.days) && s.days.includes(todayDow))
      .map(s => ({ ...s, instructor: instMap[s.instructorId] || null, students: (s.studentIds || []).map(id => studMap[id]).filter(Boolean) }))
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [schedules, instructors, students, todayDow]);

  const allItems = useMemo(() => {
    const instMap = Object.fromEntries(instructors.map(i => [i.id, i]));
    const studMap = Object.fromEntries(students.map(s => [s.id, s]));
    return schedules
      .filter(s => s.active !== false)
      .map(s => ({ ...s, instructor: instMap[s.instructorId] || null, students: (s.studentIds || []).map(id => studMap[id]).filter(Boolean) }))
      .sort((a, b) => (a.days?.[0] ?? 0) - (b.days?.[0] ?? 0) || (a.startTime || '').localeCompare(b.startTime || ''));
  }, [schedules, instructors, students]);

  const displayedItems = showAllSchedules ? allItems : todaysItems;

  const toggleDay = (id) => {
    setForm(prev => ({ ...prev, days: prev.days.includes(id) ? prev.days.filter(d => d !== id) : [...prev.days, id] }));
  };

  const toggleStudent = (studentId) => {
    setForm(prev => ({ 
      ...prev, 
      studentIds: prev.studentIds.includes(studentId) 
        ? prev.studentIds.filter(id => id !== studentId) 
        : [...prev.studentIds, studentId] 
    }));
  };

  const filteredStudents = students.filter(student => 
    student.nome.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const saveSchedule = async (e) => {
    e.preventDefault();
    
    // Validações obrigatórias
    if (!form.instructorId) {
      alert('Por favor, selecione um instrutor.');
      return;
    }
    if (form.studentIds.length === 0) {
      alert('Por favor, selecione pelo menos um aluno/paciente.');
      return;
    }
    if (!form.discipline) {
      alert('Por favor, selecione uma disciplina.');
      return;
    }
    if (form.days.length === 0) {
      alert('Por favor, selecione pelo menos um dia da semana.');
      return;
    }
    
    setSaving(true);
    try {
      const scheduleRef = await addDoc(collection(db, 'schedules'), {
        instructorId: form.instructorId,
        studentIds: form.studentIds,
        discipline: form.discipline,
        days: form.days,
        startTime: form.startTime,
        endTime: form.endTime,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        active: true,
        createdAt: Date.now(),
      });
      // opcional: subcoleção de inscrições
      for (const sid of form.studentIds) {
        await addDoc(collection(db, `schedules/${scheduleRef.id}/enrollments`), { studentId: sid, createdAt: Date.now() });
      }
      setShowAddModal(false);
      setForm({ instructorId: '', studentIds: [], discipline: '', days: [], startTime: '10:00', endTime: '11:00', startDate: '', endDate: '' });
      setStudentSearch('');
      setActiveTab('instructor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#00A36C] to-[#50C878] rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-lg opacity-90">
          Bem-vindo, <span className="font-semibold">{storeEmail || user?.email || 'usuário'}</span>
        </p>
        <div className="mt-4">
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded" style={{ backgroundColor: colors.tertiary, color: colors.text }}>
            <Plus size={16} /> Nova agenda
          </button>
        </div>
      </div>
      
      {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ title, icon: Icon, description }) => (
          <div
            key={title}
            className="rounded-lg p-6 cursor-pointer transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: '#2a2a40', 
              border: '1px solid #1d8cf8',
              color: '#e6e6f0'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: '#1d8cf8' }}
              >
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-sm opacity-75">{description}</p>
          </div>
        ))}
      </div> */}

      <div className="rounded-lg p-6" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}`, color: colors.text }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Calendar size={18} /> {showAllSchedules ? 'Todas as agendas' : 'Agenda de hoje'}</h3>
          <label className="text-sm flex items-center gap-2" style={{ color: '#cdd4e2' }}>
            <input type="checkbox" checked={showAllSchedules} onChange={(e) => setShowAllSchedules(e.target.checked)} /> Mostrar todas
          </label>
        </div>
        {displayedItems.length === 0 ? (
          <div className="text-sm" style={{ color: '#cdd4e2' }}>Sem horários registrados para hoje.</div>
        ) : (
          <div className="space-y-2">
            {displayedItems.map(item => (
              <button key={item.id} onClick={() => setShowDetails(item)} className="w-full text-left rounded px-3 py-2 hover:opacity-90" style={{ backgroundColor: colors.panelAlt, border: `1px solid ${colors.border}` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{item.startTime} - {item.endTime} • {item.discipline || 'Atividade'}</div>
                    <div className="text-sm" style={{ color: '#cdd4e2' }}>
                      Instrutor: {item.instructor?.nome || '—'} • Alunos/Pacientes: {(item.students || []).map(s => s?.nome).filter(Boolean).join(', ') || '—'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Semana atual */}
      <div className="rounded-lg p-6" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}`, color: colors.text }}>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Calendar size={18} /> Semana atual</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {weekDates.map((d) => {
            const dow = d.getDay();
            const dateISO = d.toISOString().slice(0,10);
            const items = schedules
              .filter(s => s.active !== false && Array.isArray(s.days) && s.days.includes(dow))
              .filter(s => {
                const startOK = !s.startDate || new Date(dateISO) >= new Date(s.startDate);
                const endOK = !s.endDate || new Date(dateISO) <= new Date(s.endDate);
                return startOK && endOK;
              })
              .sort((a,b) => (a.startTime || '').localeCompare(b.startTime || ''));
            const instMap = Object.fromEntries(instructors.map(i => [i.id, i]));
            const studMap = Object.fromEntries(students.map(s => [s.id, s]));
            return (
              <div key={dateISO} className="rounded border p-3" style={{ borderColor: colors.border }}>
                <div className="font-semibold mb-2">{d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</div>
                {items.length === 0 ? (
                  <div className="text-sm" style={{ color: '#cdd4e2' }}>Sem horários</div>
                ) : (
                  <div className="space-y-2">
                    {items.map((s) => (
                      <button key={`${s.id}-${dateISO}`} onClick={() => setShowDetails({ ...s, instructor: instMap[s.instructorId] || null, students: (s.studentIds || []).map(id => studMap[id]).filter(Boolean) })} className="w-full text-left rounded px-2 py-1 hover:opacity-90" style={{ backgroundColor: colors.panelAlt, border: `1px solid ${colors.border}` }}>
                        <div className="text-sm font-semibold">{s.startTime} - {s.endTime}</div>
                        <div className="text-xs" style={{ color: '#cdd4e2' }}>{s.discipline || 'Atividade'}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="absolute inset-x-0 top-8 mx-auto max-w-4xl w-full rounded-lg p-6 space-y-4" style={{ backgroundColor: colors.panelAlt, border: `1px solid ${colors.border}`, color: colors.text }}>
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Nova agenda recorrente</h4>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded border" style={{ borderColor: colors.border, color: colors.buttonInactiveText }}><X size={16} /></button>
            </div>
            <form onSubmit={saveSchedule} className="space-y-4">
              {/* Abas */}
              <div className="flex gap-2 flex-wrap" role="tablist">
                <button 
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'instructor'} 
                  onClick={() => setActiveTab('instructor')} 
                  className="px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={activeTab === 'instructor' 
                    ? { backgroundColor: colors.buttonActiveBg, color: colors.buttonActiveText } 
                    : { backgroundColor: colors.panel, color: colors.text, border: `1px solid ${colors.border}` }
                  }
                >
                  Instrutor e Alunos
                </button>
                <button 
                  type="button" 
                  role="tab" 
                  aria-selected={activeTab === 'schedule'} 
                  onClick={() => setActiveTab('schedule')} 
                  className="px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={activeTab === 'schedule' 
                    ? { backgroundColor: colors.buttonActiveBg, color: colors.buttonActiveText } 
                    : { backgroundColor: colors.panel, color: colors.text, border: `1px solid ${colors.border}` }
                  }
                >
                  Horários e Recorrência
                </button>
              </div>

              {/* Tab: Instrutor e Alunos */}
              {activeTab === 'instructor' && (
                <div className="rounded-lg p-4" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Users size={18} />
                    Instrutor e Alunos/Pacientes
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm block mb-1">Instrutor *</label>
                      <select 
                        value={form.instructorId} 
                        onChange={(e) => setForm(f => ({ ...f, instructorId: e.target.value }))} 
                        className="w-full rounded px-3 py-2" 
                        style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }}
                        required
                      >
                        <option value="">Selecione um instrutor *</option>
                        {instructors.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm block mb-1">Disciplina *</label>
                      <select 
                        value={form.discipline} 
                        onChange={(e) => setForm(f => ({ ...f, discipline: e.target.value }))} 
                        className="w-full rounded px-3 py-2" 
                        style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }}
                        required
                      >
                        <option value="">Selecione uma disciplina *</option>
                        {disciplines.map(d => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="text-sm block mb-1">Alunos/Pacientes *</label>
                    <input 
                      type="text"
                      placeholder="Buscar por nome..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full rounded px-3 py-2 mb-2" 
                      style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }}
                    />
                    <div className="max-h-40 overflow-y-auto border rounded p-3" style={{ borderColor: colors.border }}>
                      <div className="flex flex-wrap gap-2">
                        {filteredStudents.map(s => (
                          <button 
                            type="button" 
                            key={s.id} 
                            onClick={() => toggleStudent(s.id)} 
                            className="px-3 py-1.5 rounded text-sm"
                            style={form.studentIds.includes(s.id) 
                              ? { backgroundColor: colors.buttonActiveBg, color: colors.buttonActiveText } 
                              : { backgroundColor: colors.secondary, color: colors.text, border: `1px solid ${colors.border}` }
                            }
                          >
                            {s.nome}
                          </button>
                        ))}
                      </div>
                      {filteredStudents.length === 0 && studentSearch && (
                        <div className="text-sm" style={{ color: colors.mutedText }}>
                          Nenhum aluno encontrado para "{studentSearch}"
                        </div>
                      )}
                    </div>
                    {form.studentIds.length > 0 && (
                      <div className="mt-2 text-sm" style={{ color: colors.mutedText }}>
                        Selecionados: {form.studentIds.length} aluno(s)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Horários e Recorrência */}
              {activeTab === 'schedule' && (
                <div className="rounded-lg p-4" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Calendar size={18} />
                    Horários e Recorrência
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm block mb-1">Início</label>
                      <input 
                        type="time" 
                        value={form.startTime} 
                        onChange={(e) => setForm(f => ({ ...f, startTime: e.target.value }))} 
                        className="w-full rounded px-3 py-2" 
                        style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }} 
                      />
                    </div>
                    <div>
                      <label className="text-sm block mb-1">Fim</label>
                      <input 
                        type="time" 
                        value={form.endTime} 
                        onChange={(e) => setForm(f => ({ ...f, endTime: e.target.value }))} 
                        className="w-full rounded px-3 py-2" 
                        style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }} 
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm block mb-1">Dias da semana *</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {daysOfWeek.map(d => (
                        <button 
                          type="button" 
                          key={d.id} 
                          onClick={() => toggleDay(d.id)} 
                          className="px-3 py-1.5 rounded text-sm"
                          style={form.days.includes(d.id) 
                            ? { backgroundColor: colors.buttonActiveBg, color: colors.buttonActiveText } 
                            : { backgroundColor: colors.secondary, color: colors.text, border: `1px solid ${colors.border}` }
                          }
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    <div>
                      <label className="text-sm block mb-1">Início da recorrência (opcional)</label>
                      <input 
                        type="date" 
                        value={form.startDate} 
                        onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))} 
                        className="w-full rounded px-3 py-2" 
                        style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }} 
                      />
                    </div>
                    <div>
                      <label className="text-sm block mb-1">Término da recorrência (opcional)</label>
                      <input 
                        type="date" 
                        value={form.endDate} 
                        onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))} 
                        className="w-full rounded px-3 py-2" 
                        style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="px-3 py-2 rounded border" 
                  style={{ borderColor: colors.border, color: colors.buttonInactiveText }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-3 py-2 rounded" 
                  style={{ backgroundColor: colors.buttonActiveBg, color: colors.buttonActiveText, border: `1px solid ${colors.border}` }}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetails(null)} />
          <div className="absolute inset-x-0 top-10 mx-auto max-w-md w-full rounded-lg p-6 space-y-3" style={{ backgroundColor: colors.panelAlt, border: `1px solid ${colors.border}`, color: colors.text }}>
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Detalhes do horário</h4>
              <button onClick={() => setShowDetails(null)} className="p-1 rounded border" style={{ borderColor: colors.border, color: colors.buttonInactiveText }}><X size={16} /></button>
            </div>
            <div><strong>Instrutor:</strong> {showDetails.instructor?.nome || '—'}</div>
            <div><strong>Alunos/Pacientes:</strong> {(showDetails.students || []).map(s => s?.nome).filter(Boolean).join(', ') || '—'}</div>
            <div><strong>Disciplina:</strong> {showDetails.discipline || '—'}</div>
            <div><strong>Horário:</strong> {showDetails.startTime} - {showDetails.endTime}</div>
            <div><strong>Dias:</strong> {Array.isArray(showDetails.days) ? showDetails.days.map(d => daysOfWeek[d]?.label).join(', ') : '—'}</div>
            <div className="flex justify-end">
              <button onClick={() => setShowDetails(null)} className="px-3 py-2 rounded border" style={{ borderColor: colors.border, color: colors.buttonInactiveText }}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


