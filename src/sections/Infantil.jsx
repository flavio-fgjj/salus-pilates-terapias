const Infantil = () => (
  <section id="infantil" className="py-20 bg-gradient-to-b from-white to-emerald-50/40 text-center">
    <div className="w-full px-4 md:px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Aulas Infantis</h2>
      <p className="text-slate-600 max-w-2xl mx-auto mb-10">Atividades lúdicas para desenvolver corpo e mente das crianças.</p>
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div className="text-left bg-white rounded-xl border border-emerald-100 p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-2 text-slate-800">Ballet Infantil</h3>
          <p className="text-slate-600">Desenvolvimento da coordenação motora, disciplina e expressão corporal.</p>
        </div>
        <div className="text-left bg-white rounded-xl border border-emerald-100 p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-2 text-slate-800">Jiu-Jitsu (até 10 anos)</h3>
          <p className="text-slate-600">Autoconfiança, foco e respeito. Aula divertida e segura para os pequenos.</p>
        </div>
      </div>
    </div>
  </section>
);

export default Infantil;
