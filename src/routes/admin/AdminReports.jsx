import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { TrendingUp, AlertCircle, CheckCircle, Users, DollarSign, Calendar, BarChart } from 'react-feather';
import colors from '../../theme/colors.js';
import { disciplines, getDisciplineLabel } from '../../data/disciplines.js';

const AdminReports = () => {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    const unsubStudents = onSnapshot(query(collection(db, 'students'), orderBy('nome')), (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    const unsubPayments = onSnapshot(query(collection(db, 'payments'), orderBy('paymentDate', 'desc')), (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    return () => { unsubStudents(); unsubPayments(); };
  }, []);

  // Função para converter Timestamp do Firestore
  const convertTimestamp = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  };

  // Função para formatar data
  const formatDate = (date) => {
    if (!date) return 'Nenhum';
    return convertTimestamp(date).toLocaleDateString('pt-BR');
  };

  // Função para formatar moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Obter pagamentos de um aluno
  const getStudentPayments = (studentId) => {
    return payments.filter(p => p.studentId === studentId);
  };

  // Verificar status de pagamento de um aluno
  const getPaymentStatus = (student) => {
    const studentPayments = getStudentPayments(student.id);
    if (studentPayments.length === 0) return 'no_payments';
    
    const latestPayment = studentPayments[0];
    const today = new Date();
    
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

  // Alunos inadimplentes
  const overdueStudents = useMemo(() => {
    return students.filter(student => {
      if (student.active === false) return false;
      return getPaymentStatus(student) === 'overdue';
    });
  }, [students, payments]);

  // Alunos ativos (com pagamentos em dia)
  const activeStudents = useMemo(() => {
    return students.filter(student => {
      if (student.active === false) return false;
      const status = getPaymentStatus(student);
      return status === 'paid' || status === 'pending';
    });
  }, [students, payments]);

  // Alunos inativos
  const inactiveStudents = useMemo(() => {
    return students.filter(student => student.active === false);
  }, [students]);

  // Alunos cadastrados em período selecionado
  const studentsInPeriod = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return [];
    
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    return students.filter(student => {
      const createdAt = convertTimestamp(student.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    });
  }, [students, dateRange]);

  // Pagamentos do mês selecionado
  const monthlyPayments = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    return payments.filter(payment => {
      const paymentDate = convertTimestamp(payment.paymentDate);
      return paymentDate >= startDate && paymentDate <= endDate && payment.status === 'paid';
    });
  }, [payments, selectedMonth]);

  // Total de fechamento no mês
  const monthlyTotal = useMemo(() => {
    return monthlyPayments.reduce((total, payment) => total + (payment.amount || 0), 0);
  }, [monthlyPayments]);

  // Total por disciplina no mês
  const monthlyByDiscipline = useMemo(() => {
    const disciplineTotals = {};
    
    monthlyPayments.forEach(payment => {
      const student = students.find(s => s.id === payment.studentId);
      if (student && student.disciplina) {
        const discipline = student.disciplina;
        disciplineTotals[discipline] = (disciplineTotals[discipline] || 0) + (payment.amount || 0);
      }
    });
    
    return Object.entries(disciplineTotals).map(([discipline, total]) => ({
      discipline,
      total,
      count: monthlyPayments.filter(p => {
        const student = students.find(s => s.id === p.studentId);
        return student && student.disciplina === discipline;
      }).length
    })).sort((a, b) => b.total - a.total);
  }, [monthlyPayments, students]);


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp size={20} />
        <h2 className="text-xl font-bold">Relatórios</h2>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg p-4" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar size={18} />
            Período de Cadastro
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1">Data Inicial</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Data Final</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full rounded px-3 py-2"
                style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }}
              />
            </div>
          </div>
          {dateRange.start && dateRange.end && (
            <div className="mt-3 text-sm" style={{ color: colors.mutedText }}>
              {studentsInPeriod.length} aluno(s) cadastrado(s) no período
            </div>
          )}
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <DollarSign size={18} />
            Fechamento Mensal
          </h3>
          <div>
            <label className="text-sm block mb-1">Mês/Ano</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded px-3 py-2"
              style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }}
            />
          </div>
          <div className="mt-3 text-sm" style={{ color: colors.mutedText }}>
            Total: <span className="font-semibold text-green-400">{formatCurrency(monthlyTotal)}</span>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-lg p-4" style={{ backgroundColor: colors.panel, border: '1px solid #ef4444' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={20} className="text-red-500" />
            <h3 className="font-semibold">Inadimplentes</h3>
          </div>
          <div className="text-2xl font-bold text-red-400">{overdueStudents.length}</div>
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a40', border: '1px solid #22c55e' }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} className="text-green-500" />
            <h3 className="font-semibold">Ativos</h3>
          </div>
          <div className="text-2xl font-bold text-green-400">{activeStudents.length}</div>
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a40', border: '1px solid #6b7280' }}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-gray-400" />
            <h3 className="font-semibold">Inativos</h3>
          </div>
          <div className="text-2xl font-bold text-gray-400">{inactiveStudents.length}</div>
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-blue-400" />
            <h3 className="font-semibold">Faturamento</h3>
          </div>
          <div className="text-2xl font-bold text-blue-400">{formatCurrency(monthlyTotal)}</div>
        </div>
      </div>

      {/* Lista de Alunos Inadimplentes */}
      <div className="rounded-lg p-4" style={{ backgroundColor: colors.panel, border: '1px solid #ef4444' }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500" />
          Alunos Inadimplentes ({overdueStudents.length})
        </h3>
        <div className="overflow-auto">
          <table className="w-full text-sm" style={{ color: colors.text }}>
            <thead style={{ color: '#cdd4e2' }}>
              <tr>
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Disciplina</th>
                <th className="text-left py-2">Telefone</th>
                <th className="text-left py-2">Último Pagamento</th>
                <th className="text-left py-2">Valor</th>
              </tr>
            </thead>
            <tbody>
              {overdueStudents.map((student) => {
                const studentPayments = getStudentPayments(student.id);
                const latestPayment = studentPayments[0];
                
                return (
                  <tr key={student.id} className="border-t" style={{ borderColor: '#ef4444' }}>
                    <td className="py-2">{student.nome}</td>
                    <td className="py-2">{getDisciplineLabel(student.disciplina)}</td>
                    <td className="py-2">{student.telefone}</td>
                    <td className="py-2">{formatDate(latestPayment?.paymentDate)}</td>
                    <td className="py-2">{formatCurrency(latestPayment?.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lista de Alunos Ativos */}
      <div className="rounded-lg p-4" style={{ backgroundColor: colors.panel, border: '1px solid #22c55e' }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-500" />
          Alunos Ativos ({activeStudents.length})
        </h3>
        <div className="overflow-auto">
          <table className="w-full text-sm" style={{ color: colors.text }}>
            <thead style={{ color: '#cdd4e2' }}>
              <tr>
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Disciplina</th>
                <th className="text-left py-2">Telefone</th>
                <th className="text-left py-2">Último Pagamento</th>
                <th className="text-left py-2">Valor</th>
              </tr>
            </thead>
            <tbody>
              {activeStudents.map((student) => {
                const studentPayments = getStudentPayments(student.id);
                const latestPayment = studentPayments[0];
                
                return (
                  <tr key={student.id} className="border-t" style={{ borderColor: '#22c55e' }}>
                    <td className="py-2">{student.nome}</td>
                    <td className="py-2">{getDisciplineLabel(student.disciplina)}</td>
                    <td className="py-2">{student.telefone}</td>
                    <td className="py-2">{formatDate(latestPayment?.paymentDate)}</td>
                    <td className="py-2">{formatCurrency(latestPayment?.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lista de Alunos Inativos */}
      <div className="rounded-lg p-4" style={{ backgroundColor: colors.panel, border: '1px solid #6b7280' }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users size={18} className="text-gray-400" />
          Alunos Inativos ({inactiveStudents.length})
        </h3>
        <div className="overflow-auto">
          <table className="w-full text-sm" style={{ color: colors.text }}>
            <thead style={{ color: '#cdd4e2' }}>
              <tr>
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Disciplina</th>
                <th className="text-left py-2">Telefone</th>
                <th className="text-left py-2">Data de Inativação</th>
              </tr>
            </thead>
            <tbody>
              {inactiveStudents.map((student) => (
                <tr key={student.id} className="border-t" style={{ borderColor: '#6b7280' }}>
                  <td className="py-2">{student.nome}</td>
                  <td className="py-2">{getDisciplineLabel(student.disciplina)}</td>
                  <td className="py-2">{student.telefone}</td>
                  <td className="py-2">{formatDate(student.deletedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alunos Cadastrados no Período */}
      {dateRange.start && dateRange.end && (
        <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-blue-400" />
            Alunos Cadastrados no Período ({studentsInPeriod.length})
          </h3>
          <div className="overflow-auto">
            <table className="w-full text-sm" style={{ color: '#e6e6f0' }}>
              <thead style={{ color: '#cdd4e2' }}>
                <tr>
                  <th className="text-left py-2">Nome</th>
                  <th className="text-left py-2">Disciplina</th>
                  <th className="text-left py-2">Telefone</th>
                  <th className="text-left py-2">Data de Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {studentsInPeriod.map((student) => (
                  <tr key={student.id} className="border-t" style={{ borderColor: '#1d8cf8' }}>
                    <td className="py-2">{student.nome}</td>
                    <td className="py-2">{getDisciplineLabel(student.disciplina)}</td>
                    <td className="py-2">{student.telefone}</td>
                    <td className="py-2">{formatDate(student.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fechamento por Disciplina */}
      <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a40', border: '1px solid #1d8cf8' }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart size={18} className="text-blue-400" />
          Fechamento por Disciplina - {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="overflow-auto">
          <table className="w-full text-sm" style={{ color: colors.text }}>
            <thead style={{ color: '#cdd4e2' }}>
              <tr>
                <th className="text-left py-2">Disciplina</th>
                <th className="text-left py-2">Quantidade de Pagamentos</th>
                <th className="text-left py-2">Total Arrecadado</th>
                <th className="text-left py-2">% do Total</th>
              </tr>
            </thead>
            <tbody>
              {monthlyByDiscipline.map((item, index) => (
                <tr key={item.discipline} className="border-t" style={{ borderColor: '#1d8cf8' }}>
                  <td className="py-2">{getDisciplineLabel(item.discipline)}</td>
                  <td className="py-2">{item.count}</td>
                  <td className="py-2 font-semibold text-green-400">{formatCurrency(item.total)}</td>
                  <td className="py-2">
                    {monthlyTotal > 0 ? ((item.total / monthlyTotal) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
