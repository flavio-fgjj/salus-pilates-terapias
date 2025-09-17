# Salus Pilates e Terapias - Landing Page

Landing page moderna e responsiva para o Espaço Salus - Pilates e Terapias, com sistema administrativo completo para gestão de alunos, instrutores, pagamentos e relatórios.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Roteamento**: React Router v6
- **Estilização**: Tailwind CSS
- **Ícones**: React Feather
- **Backend**: Firebase (Auth + Firestore)
- **Estado Global**: Zustand
- **Deploy**: Vercel

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.jsx      # Cabeçalho da landing page
│   └── Footer.jsx      # Rodapé da landing page
├── sections/           # Seções da landing page
│   ├── Hero.jsx        # Seção principal
│   ├── Pilates.jsx     # Seção sobre Pilates
│   ├── Servicos.jsx    # Serviços oferecidos
│   ├── Infantil.jsx    # Atividades infantis
│   ├── Sobre.jsx       # Sobre o espaço
│   └── Contato.jsx     # Informações de contato
├── routes/admin/       # Sistema administrativo
│   ├── AdminLayout.jsx     # Layout do admin
│   ├── AdminLogin.jsx      # Tela de login
│   ├── AdminSignup.jsx     # Cadastro de usuários
│   ├── AdminDashboard.jsx  # Dashboard principal
│   ├── AdminUsers.jsx      # Gestão de usuários
│   ├── AdminStudents.jsx   # Gestão de alunos
│   ├── AdminInstructors.jsx # Gestão de instrutores
│   ├── AdminPayments.jsx   # Controle de pagamentos
│   ├── AdminReports.jsx    # Relatórios
│   └── AuthContext.jsx     # Contexto de autenticação
├── store/              # Estado global
│   └── useUserStore.js # Store do usuário
└── firebase.js         # Configuração do Firebase
```

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/salus-landing-page.git
cd salus-landing-page
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
```

### 4. Configure o Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Authentication (Email/Password)
3. Crie um banco Firestore
4. Configure as regras de segurança (veja seção abaixo)

### 5. Execute o projeto
```bash
npm run dev
```

## 🔐 Regras de Segurança do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários - apenas admins podem gerenciar
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow read: if request.auth != null && request.auth.uid == userId;
    }
    
    // Alunos - usuários autenticados podem ler, admins podem gerenciar
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Instrutores - usuários autenticados podem ler, admins podem gerenciar
    match /instructors/{instructorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Pagamentos - usuários autenticados podem ler, admins podem gerenciar
    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Agendas - usuários autenticados podem ler, admins podem gerenciar
    match /schedules/{scheduleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras plataformas
```bash
npm run build
# A pasta 'dist' conterá os arquivos para deploy
```

## 📱 Funcionalidades

### Landing Page
- ✅ Design responsivo e moderno
- ✅ Seções informativas sobre serviços
- ✅ Integração com WhatsApp
- ✅ Box promocional
- ✅ Otimização SEO

### Sistema Administrativo
- ✅ Autenticação segura
- ✅ Gestão de usuários (admin/instrutor)
- ✅ Cadastro completo de alunos
- ✅ Gestão de instrutores
- ✅ Controle de pagamentos (mensalidades e aulas avulsas)
- ✅ Sistema de agenda
- ✅ Relatórios detalhados
- ✅ Interface responsiva

## 🎨 Design System

### Cores Principais
- **Primária**: #B7D0CA (Verde suave)
- **Secundária**: #1d8cf8 (Azul)
- **Fundo**: #1e1e2f (Escuro)
- **Texto**: #e6e6f0 (Claro)

### Tipografia
- **Títulos**: Font-bold
- **Corpo**: Font-normal
- **Pequeno**: Text-sm

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato:
- **Email**: contato@espacosalus.com.br
- **WhatsApp**: (13) 99612-4760
- **Instagram**: @espacosalusbr

---

Desenvolvido com ❤️ para o Espaço Salus - Pilates e Terapias