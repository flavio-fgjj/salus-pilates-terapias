const Servicos = () => (
  <section id="servicos" className="py-20 bg-gradient-to-b from-slate-50 to-white text-center">
    <div className="w-full px-4 md:px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Nossos Serviços</h2>
      <p className="text-slate-600 max-w-2xl mx-auto mb-12">Terapias complementares e atividades para equilibrar corpo e mente.</p>
      
      {/* Terapias */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold mb-8 text-[#B7D0CA]">Terapias</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: 'Acupuntura', desc: 'Terapêutica e estética para equilíbrio do corpo e bem-estar.' },
            { title: 'Massagem', desc: 'Alívio de tensões e relaxamento profundo para o corpo.' },
            { title: 'Quiropraxia', desc: 'Ajustes vertebrais para alinhamento e alívio de dores.' },
            { title: 'Radiestesia Terapêutica', desc: 'Técnica de diagnóstico e tratamento energético.' },
            { title: 'Reiki', desc: 'Técnica japonesa para redução de estresse e cura energética.' }
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="group relative bg-white rounded-xl border border-[#B7D0CA]/40 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#B7D0CA]/10 transition" />
              <div className="relative">
                <h4 className="text-xl font-bold mb-2 text-slate-800">{title}</h4>
                <p className="text-slate-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atividades Infantis */}
      <div>
        <h3 className="text-2xl font-bold mb-8 text-[#B7D0CA]">Atividades Infantis</h3>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {[
            { title: 'Ballet Infantil', desc: 'Desenvolvimento da coordenação motora, disciplina e expressão corporal para crianças.' },
            { title: 'Jiu-Jitsu (até 10 anos)', desc: 'Autoconfiança, foco e respeito. Aulas divertidas e seguras para os pequenos.' }
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="group relative bg-white rounded-xl border border-[#B7D0CA]/40 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#B7D0CA]/10 transition" />
              <div className="relative">
                <h4 className="text-xl font-bold mb-2 text-slate-800">{title}</h4>
                <p className="text-slate-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Servicos;
