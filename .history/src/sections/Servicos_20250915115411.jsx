const Servicos = () => (
  <section id="servicos" className="py-16 bg-gray-50 text-center">
    <div className="w-full px-4 md:px-6">
      <h2 className="text-3xl font-bold mb-10">Outros Serviços</h2>
      <div className="grid md:grid-cols-3 gap-8">
      {[
        { title: 'Acupuntura', desc: 'Tratamento terapêutico para equilíbrio do corpo.' },
        { title: 'Reiki', desc: 'Técnica japonesa para redução de estresse e cura.' },
        { title: 'Massagem', desc: 'Alívio de tensões e relaxamento profundo.' }
      ].map(({ title, desc }) => (
        <div key={title} className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p>{desc}</p>
        </div>
      ))}
      </div>
    </div>
  </section>
);

export default Servicos;
