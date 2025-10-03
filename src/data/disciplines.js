// Lista centralizada de disciplinas disponíveis
export const disciplines = [
  { value: 'auriculoterapia', label: 'Auriculoterapia' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'pilates experimental', label: 'Pilates Experimental' },
  { value: 'ballet', label: 'Ballet Infantil' },
  { value: 'ballet experimental', label: 'Ballet Experimental' },
  { value: 'jiu-jitsu', label: 'Jiu-Jitsu' },
  { value: 'jiu-jitsu experimental', label: 'Jiu-Jitsu Experimental' },
  { value: 'acupuntura', label: 'Acupuntura' },
  { value: 'massagem', label: 'Massagem' },
  { value: 'quiropraxia', label: 'Quiropraxia' },
  { value: 'reiki', label: 'Reiki' },
  { value: 'radiestesia', label: 'Radiestesia' },
  { value: 'cone hindu / chines', label: 'Cone Hindu / Chines' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'yoga experimental', label: 'Yoga Experimental' },
];

// Lista simples para compatibilidade com AdminInstructors
export const allDisciplines = disciplines.map(d => d.label);

// Função utilitária para obter o label de uma disciplina
export const getDisciplineLabel = (value) => {
  const discipline = disciplines.find(d => d.value === value);
  return discipline ? discipline.label : value;
};

// Função utilitária para obter o value de uma disciplina pelo label
export const getDisciplineValue = (label) => {
  const discipline = disciplines.find(d => d.label === label);
  return discipline ? discipline.value : label;
};

export default disciplines;
