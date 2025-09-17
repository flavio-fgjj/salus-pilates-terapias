# 📚 Guia do Usuário - Sistema Salus

Bem-vindo ao sistema de gestão do Espaço Salus - Pilates e Terapias! Este guia irá ajudá-lo a utilizar todas as funcionalidades do sistema administrativo.

## 🔐 Acesso ao Sistema

### Primeiro Acesso
1. Acesse: `https://seu-dominio.com/admin`
2. Clique em "Criar usuário"
3. Preencha os dados:
   - Nome completo
   - CPF
   - Telefone
   - Email
   - Senha
4. Aguarde aprovação do administrador

### Login
1. Acesse: `https://seu-dominio.com/admin`
2. Digite seu email e senha
3. Clique em "Entrar"

## 👥 Gestão de Usuários (Apenas Administradores)

### Aprovar Novos Usuários
1. Acesse **Usuários** no menu lateral
2. Localize usuários com status "Pendente"
3. Clique em "Ativar" para aprovar
4. Altere o cargo se necessário (Admin/Instrutor)

### Gerenciar Usuários Existentes
- **Ativar/Desativar**: Controle o acesso ao sistema
- **Alterar Cargo**: Mude entre Admin e Instrutor
- **Editar Dados**: Atualize informações pessoais

## 👨‍🎓 Gestão de Alunos

### Cadastrar Novo Aluno
1. Acesse **Alunos** no menu lateral
2. Clique em "Novo aluno"
3. Preencha as abas:

#### 📋 Dados Pessoais
- Nome completo *
- Email
- Telefone
- Data de nascimento
- Documento (CPF/RG)
- **Disciplina** (Pilates, Ballet, etc.)

#### 👨‍👩‍👧‍👦 Responsável (para menores)
- Nome do responsável
- Telefone do responsável

#### 🏠 Endereço
- CEP (busca automática via ViaCEP)
- Logradouro, número, complemento
- Bairro, cidade, estado

#### ⚙️ Configurações
- **Disciplina** (obrigatório)
- **Frequência** (1x, 2x, 3x, 4x, 5x por semana ou Aula avulsa)
- **Valor da Mensalidade** (para frequências regulares)
- **Valor da Aula Avulsa** (para aulas avulsas)
- Forma de pagamento
- Data de vencimento
- Autorização para fotos no Instagram

### Gerenciar Alunos
- **Buscar**: Use a barra de pesquisa
- **Editar**: Clique em "Editar" na linha do aluno
- **Inativar**: Clique em "Inativar" (soft delete)
- **Restaurar**: Para alunos inativos, clique em "Restaurar"
- **Imprimir Contrato**: Gera contrato personalizado
- **Imprimir Termo de Imagem**: Gera termo de autorização

## 👨‍🏫 Gestão de Instrutores

### Cadastrar Instrutor
1. Acesse **Instrutores** no menu lateral
2. Clique em "Novo instrutor"
3. Preencha as abas:

#### 📋 Dados Pessoais
- Nome completo
- Email
- Telefone

#### 🏠 Endereço
- CEP (busca automática)
- Endereço completo

#### 🎯 Disciplinas
- Selecione as disciplinas que o instrutor ministra
- Pode selecionar múltiplas opções

### Gerenciar Instrutores
- **Buscar**: Por nome, email, telefone ou disciplina
- **Editar**: Atualizar informações
- **Inativar/Restaurar**: Controle de status

## 💰 Controle de Pagamentos

### Registrar Pagamento
1. Acesse **Pagamentos** no menu lateral
2. Clique em "Novo Pagamento"
3. Preencha:
   - **Aluno**: Selecione da lista
   - **Valor**: Valor do pagamento
   - **Status**: Pago, Pendente ou Em atraso
   - **Data do Pagamento**: Quando foi pago
   - **Data de Vencimento**: Data limite (para aulas avulsas, use a data da aula)
   - **Forma de Pagamento**: PIX, Cartão, Dinheiro, etc.
   - **Observações**: Ex: "Aula de massagem", "Sessão de acupuntura"

### Visualizar Status de Pagamentos
- **Pago** (verde): Pagamento realizado
- **Pendente** (amarelo): Aguardando pagamento
- **Em atraso** (vermelho): Pagamento vencido
- **Sem pagamentos**: Aluno nunca pagou

### Histórico de Pagamentos
1. Na lista de pagamentos, clique em "Histórico"
2. Visualize todos os pagamentos do aluno
3. Edite pagamentos individuais
4. Veja total arrecadado por aluno

## 📊 Relatórios

### Acessar Relatórios
1. Acesse **Relatórios** no menu lateral (apenas admins)
2. Use os filtros disponíveis

### Tipos de Relatórios

#### 📈 Resumo Geral
- **Inadimplentes**: Alunos com pagamentos em atraso
- **Ativos**: Alunos com pagamentos em dia
- **Inativos**: Alunos desativados
- **Faturamento**: Total arrecadado no mês

#### 📅 Alunos por Período
1. Selecione data inicial e final
2. Veja alunos cadastrados no período
3. Útil para análise de crescimento

#### 💰 Fechamento Mensal
1. Selecione o mês/ano
2. Veja total arrecadado
3. Análise por disciplina
4. Percentual de contribuição de cada modalidade

#### 📋 Listas Detalhadas
- **Inadimplentes**: Lista completa com contatos
- **Ativos**: Alunos em dia com pagamentos
- **Inativos**: Alunos desativados
- **Por Período**: Cadastros em período específico

## 📅 Sistema de Agenda

### Visualizar Agenda
1. No **Dashboard**, veja a agenda do dia
2. Use "Mostrar todas" para ver todos os horários
3. Clique em um horário para ver detalhes

### Criar Nova Agenda
1. Clique em "Nova agenda"
2. Preencha:
   - **Instrutor**: Quem ministrará
   - **Alunos**: Pode selecionar múltiplos
   - **Disciplina**: Tipo de aula
   - **Dias da semana**: Quais dias acontece
   - **Horário**: Início e fim
   - **Recorrência**: Data de início e fim (opcional)

### Agenda da Semana
- Visualize todos os horários da semana
- Organizados por dia
- Clique para ver detalhes

## 🎯 Dicas e Boas Práticas

### Para Aulas Avulsas
- Use o campo "Observações" para especificar o tipo de serviço
- A data de vencimento pode ser a data da própria aula
- Cada pagamento é independente

### Para Mensalidades
- Defina data de vencimento consistente (ex: dia 5 de cada mês)
- Use o campo "Frequência" para controlar quantas vezes por semana
- Monitore inadimplência regularmente

### Organização
- Use a busca para encontrar alunos rapidamente
- Mantenha dados atualizados (telefones, endereços)
- Revise relatórios mensalmente

### Segurança
- Faça logout ao sair do sistema
- Não compartilhe suas credenciais
- Alunos inativos não aparecem nas listas principais

## 🆘 Solução de Problemas

### Não consigo fazer login
- Verifique se o usuário está ativo
- Confirme email e senha
- Entre em contato com o administrador

### Aluno não aparece na lista
- Verifique se não está inativo
- Use a busca por nome
- Confirme se foi cadastrado corretamente

### Pagamento não registrado
- Verifique se o aluno foi selecionado
- Confirme se clicou em "Registrar"
- Verifique a conexão com internet

### Erro ao salvar dados
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme a conexão com internet
- Tente novamente em alguns minutos

## 📞 Suporte

Para dúvidas ou problemas:
- **WhatsApp**: (13) 99612-4760
- **Email**: contato@espacosalus.com.br
- **Instagram**: @espacosalusbr

---

**Versão do Sistema**: 1.0  
**Última Atualização**: Janeiro 2025

*Este guia é atualizado regularmente. Consulte sempre a versão mais recente.*
