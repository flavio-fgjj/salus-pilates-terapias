import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase.js';
import colors from '../../theme/colors.js';

const AdminForgot = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('sent');
    } catch (err) {
      setError('Não foi possível enviar o email de recuperação.');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-sm mx-auto rounded-lg p-6 shadow-sm" style={{ backgroundColor: colors.panel, color: colors.text }}>
      <h2 className="text-xl font-bold mb-2">Recuperar senha</h2>
      <p className="text-sm mb-4" style={{ color: colors.mutedText }}>
        Informe seu email e enviaremos um link para redefinir a senha.
      </p>
      {status === 'sent' ? (
        <div className="text-sm" style={{ color: '#9be7ff' }}>
          Se existir uma conta com este email, um link foi enviado.
          Verifique sua caixa de entrada e spam.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded px-3 py-2" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.border}`, color: colors.text }} />
          </div>
          {error && <div className="text-sm" style={{ color: '#ff6b6b' }}>{error}</div>}
          <button disabled={status === 'sending'} type="submit" className="w-full font-semibold rounded px-3 py-2" style={{ backgroundColor: colors.buttonActiveBg, color: colors.buttonActiveText, border: `1px solid ${colors.border}` }}>
            {status === 'sending' ? 'Enviando…' : 'Enviar link'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminForgot;



