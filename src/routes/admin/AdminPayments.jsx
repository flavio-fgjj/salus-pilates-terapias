import { useEffect, useMemo, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { CreditCard, Calendar, AlertCircle, CheckCircle, DollarSign } from 'react-feather';

const AdminPayments = () => {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [term, setTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [form, setForm] = useState({
    studentId: '',
    amount: '',
    paymentDate: '',
    dueDate: '',
    status: 'paid', // paid, pending, overdue
    paymentMethod: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const paymentMethods = [
    { value: 'pix', label: 'PIX' },
    { value: 'cartao', label: 'Cartão de Crédito' },
    { value: 'debito', label: 'Cartão de Débito' },
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'transferencia', label: 'Transferência' },
  ];

  const paymentStatuses = [
    { value: 'paid', label: 'Pago', color: '#22c55e' },
    { value: 'pending', label: 'Pendente', color: '#f59e0b' },
    { value: 'overdue', label: 'Em atraso', color: '#ef4444' },
  ];

  useEffect(() => {
    const unsubStudents = onSnapshot(query(collection(db, 'students'), orderBy('nome')), (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    const unsubPayments = onSnapshot(query(collection(db, 'payments'), orderBy('paymentDate', 'desc')), (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    return () => { unsubStudents(); unsubPayments(); };
  }, []);

  const filteredStudents = useMemo(() => {
    const t = term.trim().toLowerCase();
    return students.filter(s => {
      const activeOk = showInactive ? true : s.active !== false;
      if (!activeOk) return false;
      if (!t) return true;
      const hay = `${s.nome || ''} ${s.email || ''} ${s.telefone || ''}`.toLowerCase();
      return hay.includes(t);
    });
  }, [students, term, showInactive]);

  const getStudentPayments = (studentId) => {
    return payments.filter(p => p.studentId === studentId);
  };

  const getPaymentStatus = (student) => {
    const studentPayments = getStudentPayments(student.id);
    if (studentPayments.length === 0) return 'no_payments';
    
    const latestPayment = studentPayments[0];
    const today = new Date();
    
    // Converter Timestamp do Firestore para Date
    let dueDate;
    if (latestPayment.dueDate && typeof latestPayment.dueDate.toDate === 'function') {
      dueDate = latestPayment.dueDate.toDate();
    } else {
      dueDate = new Date(latestPayment.dueDate);
    }
    
    if (latestPayment.status === 'paid') return 'paid';
    if (dueDate < today) return 'overdue';
    return 'pending';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'Nenhum';
    // Se for um objeto Timestamp do Firestore
    if (date && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString('pt-BR');
    }
    // Se for uma string ou Date normal
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const paymentData = {
        ...form,
        amount: parseFloat(form.amount),
        paymentDate: new Date(form.paymentDate),
        dueDate: new Date(form.dueDate),
        createdAt: Date.now(),
      };

      if (editingPayment) {
        await updateDoc(doc(db, 'payments', editingPayment.id), {
          ...paymentData,
          updatedAt: Date.now(),
        });
        setMessage('Pagamento atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'payments'), paymentData);
        setMessage('Pagamento registrado com sucesso!');
      }
      
      setShowPaymentModal(false);
      setEditingPayment(null);
      setForm({
        studentId: '',
        amount: '',
        paymentDate: '',
        dueDate: '',
        status: 'paid',
        paymentMethod: '',
        notes: '',
      });
    } catch (error) {
      setMessage('Erro ao salvar pagamento. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (payment) => {
    setEditingPayment(payment);
    
    // Converter Timestamps do Firestore para formato de input date
    let paymentDate, dueDate;
    if (payment.paymentDate && typeof payment.paymentDate.toDate === 'function') {
      paymentDate = payment.paymentDate.toDate().toISOString().split('T')[0];
    } else {
      paymentDate = new Date(payment.paymentDate).toISOString().split('T')[0];
    }
    
    if (payment.dueDate && typeof payment.dueDate.toDate === 'function') {
      dueDate = payment.dueDate.toDate().toISOString().split('T')[0];
    } else {
      dueDate = new Date(payment.dueDate).toISOString().split('T')[0];
    }
    
    setForm({
      studentId: payment.studentId,
      amount: payment.amount.toString(),
      paymentDate,
      dueDate,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      notes: payment.notes || '',
    });
    setShowPaymentModal(true);
  };

  const newPayment = (studentId = '') => {
    setEditingPayment(null);
    setForm({
      studentId,
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'paid',
      paymentMethod: '',
      notes: '',
    });
    setShowPaymentModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-green-500" />;
      case 'pending': return <Calendar size={16} className="text-yellow-500" />;
      case 'overdue': return <AlertCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard size={20} />
        <h2 className="text-xl font-bold">Controle de Pagamentos</h2>
      </div>

      {/* Filtros */}
      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar por nome, email ou telefone"
            className="flex-1 rounded px-3 py-2"
            style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
          />
          <label className="flex items-center gap-2 text-sm" style={{ color: '#cdd4e2' }}>
            <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
            Mostrar inativos
          </label>
          <button
            type="button"
            onClick={() => newPayment()}
            className="px-3 py-2 rounded font-semibold"
            style={{ backgroundColor: '#1d8cf8', color: '#fff', border: '1px solid #1d8cf8' }}
          >
            Novo Pagamento
          </button>
        </div>
      </div>

      {/* Lista de Alunos com Status de Pagamento */}
      <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
        <h3 className="text-lg font-semibold mb-4">Status de Pagamentos</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm" style={{ color: '#e6e6f0' }}>
            <thead style={{ color: '#cdd4e2' }}>
              <tr>
                <th className="text-left py-2">Aluno</th>
                <th className="text-left py-2">Disciplina</th>
                <th className="text-left py-2">Último Pagamento</th>
                <th className="text-left py-2">Valor</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const studentPayments = getStudentPayments(student.id);
                const latestPayment = studentPayments[0];
                const status = getPaymentStatus(student);
                
                return (
                  <tr key={student.id} className="border-t" style={{ borderColor: '#1d8cf8' }}>
                    <td className="py-2">{student.nome}</td>
                    <td className="py-2">{student.disciplina}</td>
                    <td className="py-2">
                      {latestPayment ? formatDate(latestPayment.paymentDate) : 'Nenhum'}
                    </td>
                    <td className="py-2">
                      {latestPayment ? formatCurrency(latestPayment.amount) : '—'}
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span style={{ color: getStatusColor(status) }}>
                          {status === 'paid' && 'Pago'}
                          {status === 'pending' && 'Pendente'}
                          {status === 'overdue' && 'Em atraso'}
                          {status === 'no_payments' && 'Sem pagamentos'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 flex gap-2">
                      <button
                        onClick={() => newPayment(student.id)}
                        className="px-2 py-1 rounded border text-xs"
                        style={{ borderColor: '#1d8cf8', color: '#1d8cf8' }}
                      >
                        Pagar
                      </button>
                      {studentPayments.length > 0 && (
                        <button
                          onClick={() => startEdit(latestPayment)}
                          className="px-2 py-1 rounded border text-xs"
                          style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPaymentModal(false)} />
          <div className="absolute inset-x-0 top-6 mx-auto max-w-md w-full rounded-lg p-6 space-y-4" style={{ backgroundColor: '#1f2437', border: '1px solid #1d8cf8' }}>
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign size={18} />
                {editingPayment ? 'Editar Pagamento' : 'Novo Pagamento'}
              </h4>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded border"
                style={{ borderColor: '#1d8cf8', color: '#1d8cf8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Aluno *</label>
                <select
                  value={form.studentId}
                  onChange={(e) => setForm(f => ({ ...f, studentId: e.target.value }))}
                  required
                  className="w-full rounded px-3 py-2"
                  style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
                >
                  <option value="">Selecione um aluno</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm block mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
                    required
                    className="w-full rounded px-3 py-2"
                    style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Status *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                    required
                    className="w-full rounded px-3 py-2"
                    style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
                  >
                    {paymentStatuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm block mb-1">Data do Pagamento *</label>
                  <input
                    type="date"
                    value={form.paymentDate}
                    onChange={(e) => setForm(f => ({ ...f, paymentDate: e.target.value }))}
                    required
                    className="w-full rounded px-3 py-2"
                    style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Data de Vencimento *</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    required
                    className="w-full rounded px-3 py-2"
                    style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm block mb-1">Forma de Pagamento</label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                  className="w-full rounded px-3 py-2"
                  style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
                >
                  <option value="">Selecione</option>
                  {paymentMethods.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm block mb-1">Observações</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="w-full rounded px-3 py-2"
                  style={{ backgroundColor: '#1e1e2f', border: '1px solid #1d8cf8', color: '#e6e6f0' }}
                />
              </div>

              {message && (
                <div className={`text-sm p-3 rounded ${message.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3 py-2 rounded border"
                  style={{ borderColor: '#1d8cf8', color: '#1d8cf8' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-2 rounded"
                  style={{ backgroundColor: '#1d8cf8', color: '#fff', border: '1px solid #1d8cf8' }}
                >
                  {loading ? 'Salvando...' : (editingPayment ? 'Atualizar' : 'Registrar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
