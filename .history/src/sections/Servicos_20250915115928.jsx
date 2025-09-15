const Servicos = () => (
  <section id="servicos" className="py-20 bg-gradient-to-b from-slate-50 to-white text-center">
    <div className="w-full px-4 md:px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Outros Serviços</h2>
      <p className="text-slate-600 max-w-2xl mx-auto mb-10">Terapias complementares para equilibrar corpo e mente.</p>
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
      {[
        { title: 'Acupuntura', desc: 'Tratamento terapêutico para equilíbrio do corpo.' },
        { title: 'Reiki', desc: 'Técnica japonesa para redução de estresse e cura.' },
        { title: 'Massagem', desc: 'Alívio de tensões e relaxamento profundo.' }
      ].map(({ title, desc }) => (
        <div
          key={title}
          className="group relative bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-emerald-50 to-sky-50 transition" />
          <div className="relative">
            <h3 className="text-xl font-bold mb-2 text-slate-800">{title}</h3>
            <p className="text-slate-600">{desc}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  </section>
);

export default Servicos;
