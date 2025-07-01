# 🗃️ Banco de Dados - Portal de Eventos Garanhuns

## ✅ Status: CONFIGURADO E FUNCIONANDO

### 🔗 Informações de Conexão

```
Host: localhost
Porta: 5432
Database: eventos_garanhuns_dev
Usuário: postgres
Senha: postgres123
String: postgresql://postgres:postgres123@localhost:5432/eventos_garanhuns_dev
```

## 🚀 Scripts Disponíveis

### Testar Conexão
```bash
npm run db:test
```
Executa teste completo de conexão e mostra estatísticas do banco.

### Criar Dados de Exemplo
```bash
npm run db:seed
```
Cria usuários e eventos de exemplo para desenvolvimento.

### Resetar Banco (se necessário)
```bash
npm run db:reset
```
Reexecuta todo o setup (use apenas se necessário).

## 📊 Estrutura Criada

### 🏗️ Tabelas
- ✅ `event_categories` - Categorias hierárquicas (18 registros)
- ✅ `events` - Eventos principais (4 exemplos)
- ✅ `user_profiles` - Perfis de usuários (4 exemplos)
- ✅ `auth.users` - Autenticação básica

### 🎯 Tipos de Enum
- `user_type_enum` - Tipos de usuário (master, event_admin, etc.)
- `user_status_enum` - Status do usuário (active, inactive, etc.)
- `event_type_enum` - Tipos de evento (musical, cultural, etc.)
- `event_status_enum` - Status do evento (draft, published, etc.)
- E mais 8 tipos personalizados...

### 🏷️ Categorias Criadas
- **Musical** (Rock, Sertanejo, etc.)
- **Forró** (Tradicional, Eletrônico, Universitário)
- **Cultural** (Teatro, Dança, Literatura, Artes Visuais)
- **Religioso** (Católico, Evangélico, Ecumênico)
- **Esportivo** (Futebol, Corrida, Ciclismo)
- E mais: Gospel, Gastronômico, Empresarial, Educacional, Social, Juvenil, Natalino

### 🎉 Eventos de Exemplo
1. **Festival de Forró de Garanhuns 2025** (Em destaque)
2. **Festa Junina da Praça** (Em destaque)  
3. **Workshop de Empreendedorismo**
4. **Show Gospel na Praça**

### 👥 Usuários de Exemplo
- **admin@garanhuns.pe.gov.br** (Master)
- **organizador@garanhuns.pe.gov.br** (Event Creator)
- **usuario@garanhuns.pe.gov.br** (End User)
- **teste@garanhuns.pe.gov.br** (Test User)

## 🔧 Para Desenvolvimento

### Frontend (React)
Use o arquivo `src/lib/database.js` que contém:
- Configurações de conexão
- Serviços de exemplo (eventService)
- Dados mock para desenvolvimento

### Exemplo de Uso no React:
```javascript
import { eventService } from './lib/database.js';

// Buscar eventos
const events = await eventService.getEvents();

// Buscar categorias
const categories = await eventService.getCategories();

// Buscar evento específico
const event = await eventService.getEventBySlug('festival-forro-garanhuns-2025');
```

## 🌐 Próximos Passos

### Para Produção:
1. **Criar API Backend** (Express.js, Fastify, etc.)
2. **Migrar para Supabase** (estrutura já compatível)
3. **Implementar autenticação** (Supabase Auth)
4. **Adicionar middleware de segurança**

### Para Desenvolvimento:
1. **Conectar frontend** aos dados do banco
2. **Implementar CRUD** de eventos
3. **Criar sistema de filtros**
4. **Adicionar upload de imagens**

## 📞 Suporte

Se houver problemas:
1. Execute `npm run db:test` para verificar conexão
2. Verifique se PostgreSQL está rodando
3. Confirme as credenciais no pgAdmin
4. Execute `npm run db:seed` se precisar recriar dados

---

**🎊 Banco 100% funcional e pronto para desenvolvimento!** 