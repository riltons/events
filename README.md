# 🎭 Portal de Eventos Garanhuns

> Sistema completo de gestão e divulgação de eventos culturais da cidade de Garanhuns, Pernambuco.

## 📋 Sobre o Projeto

O Portal de Eventos Garanhuns é uma plataforma web moderna e responsiva desenvolvida para centralizar e divulgar todos os eventos culturais da cidade de Garanhuns/PE. O sistema oferece uma experiência rica e interativa para diferentes tipos de usuários, desde visitantes até organizadores de eventos.

### 🌟 Características Principais

- **📱 Totalmente Responsivo** - Interface otimizada para mobile, tablet e desktop
- **🎯 Eventos em Destaque** - Sistema de destaque para os principais eventos da cidade
- **📅 Eventos da Semana** - Seção dedicada aos eventos atuais
- **🗞️ Central de Notícias** - Sistema completo de notícias sobre eventos
- **🏛️ Eventos Oficiais** - Integração com eventos da prefeitura
- **🎪 Eventos Privados** - Cadastro para estabelecimentos locais
- **🔍 Sistema de Busca** - Filtros avançados por categoria, data e tipo

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Shadcn/ui
- **Database:** PostgreSQL + Supabase
- **Icons:** Lucide React
- **Build:** Vite
- **Deploy:** Vercel (recomendado)

## 🏗️ Estrutura do Projeto

```
eventsApp/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (Shadcn/ui)
│   │   ├── EventsContainer.jsx
│   │   ├── NewsCarousel.jsx
│   │   └── NotificationSystem.jsx
│   ├── data/               # Dados estáticos e mocks
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilitários e configurações
│   ├── services/           # Serviços de API
│   └── App.tsx             # Componente principal
├── database/               # Scripts e migrações do banco
│   ├── migrations/
│   ├── seeds/
│   └── scripts/
├── docs/                   # Documentação do projeto
└── public/                 # Arquivos estáticos
```

## 🎯 Funcionalidades Implementadas

### ✅ Para Usuários Finais
- [x] Visualização de eventos em destaque
- [x] Listagem de eventos da semana
- [x] Detalhes completos dos eventos
- [x] Sistema de favoritos
- [x] Central de notícias
- [x] Interface responsiva
- [x] Filtros por categoria e tipo

### ✅ Para Administradores
- [x] Dashboard administrativo
- [x] Gerenciamento de eventos
- [x] Sistema de aprovação
- [x] Gestão de notícias
- [x] Relatórios e analytics

### ✅ Sistema de Eventos
- [x] Eventos oficiais da prefeitura
- [x] Eventos privados de estabelecimentos
- [x] Sistema de categorização
- [x] Múltiplos locais e horários
- [x] Informações detalhadas
- [x] Galeria de mídias

## 🛠️ Instalação e Execução

### **Pré-requisitos**
- Node.js 18+
- PostgreSQL 15+
- npm ou yarn

### **1. Clone o repositório**
```bash
git clone https://github.com/SEU_USUARIO/eventos-garanhuns-portal.git
cd eventos-garanhuns-portal
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure o banco de dados**
```bash
# Configure o PostgreSQL local
.\database\scripts\setup_local.ps1

# Ou execute as migrações manualmente
psql -h localhost -U postgres -d eventos_garanhuns_dev -f database/migrations/001_create_enums.sql
# ... demais migrações
```

### **4. Configure as variáveis de ambiente**
```bash
# Crie o arquivo .env baseado no .env.example
cp .env.example .env

# Edite as configurações do banco
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### **5. Execute o projeto**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 🗄️ Banco de Dados

O projeto utiliza PostgreSQL com as seguintes tabelas principais:

- **events** - Eventos do sistema
- **event_categories** - Categorias de eventos
- **user_profiles** - Perfis de usuários
- **event_news** - Notícias relacionadas a eventos

### **Scripts Úteis**
```bash
# Criar eventos de teste
node create-sample-data.js

# Verificar conexão
node test-connection.js

# Setup completo
.\database\scripts\setup_local.ps1
```

## 🎨 Principais Eventos Contemplados

- **🎭 Festival de Inverno de Garanhuns (FIG)** - Julho
- **🎵 Viva Garanhuns** - Maio (São João)
- **🙏 Festival Gospel** - Dezembro/Janeiro
- **⛪ Festividades de Santo Antônio** - Junho
- **🎪 Jazz Festival** - Março
- **🎄 Eventos Natalinos** - Dezembro

## 📱 Responsividade Mobile

O projeto foi otimizado especialmente para dispositivos móveis:

- ✅ Hero section limpa em mobile
- ✅ Cards informativos ocultos em telas pequenas
- ✅ Navegação mobile-first
- ✅ Performance otimizada
- ✅ Touch-friendly interface

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento:** Portal de Eventos Garanhuns Team
- **Design:** UX/UI responsivo e moderno
- **Conteúdo:** Secretaria de Cultura de Garanhuns

## 🎯 Roadmap

### 🔄 Próximas Funcionalidades
- [ ] Sistema de ingressos integrado
- [ ] Notificações push
- [ ] App mobile nativo
- [ ] Integração com redes sociais
- [ ] Sistema de avaliações
- [ ] Mapa interativo de eventos
- [ ] Chat/suporte ao vivo
- [ ] Analytics avançados

## 📞 Contato

- **Email:** dev@eventosgaranhuns.com.br
- **Site:** [Portal de Eventos Garanhuns](https://eventosgaranhuns.com.br)
- **Prefeitura:** [garanhuns.pe.gov.br](https://garanhuns.pe.gov.br)

---

<p align="center">
  Desenvolvido com ❤️ para a cultura de Garanhuns/PE
</p>
