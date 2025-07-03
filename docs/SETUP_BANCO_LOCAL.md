# 🚀 Setup Rápido - Banco de Dados Local

## ⚡ Próximos Passos Imediatos

### **1. Instalar PostgreSQL**
**IMPORTANTE:** Você precisa instalar o PostgreSQL antes de continuar.

**Download direto:**
- Acesse: https://www.postgresql.org/download/windows/
- Baixe PostgreSQL 16.x para Windows
- Execute como administrador
- **Senha do postgres:** use `postgres123` (anote!)

### **2. Executar Setup Automático**
Após instalar o PostgreSQL:

```powershell
# Na pasta raiz do projeto (eventsApp)
.\database\scripts\setup_local.ps1
```

### **3. Verificar se Funcionou**
```powershell
# Testar conexão
psql -h localhost -U eventos_user -d eventos_garanhuns_dev

# No psql, verificar tabelas:
\dt

# Verificar categorias:
SELECT name, slug FROM event_categories LIMIT 5;
```

## 📁 Arquivos Criados

✅ **Migrações:**
- `001_create_enums.sql` - Tipos personalizados
- `002_create_event_categories.sql` - Categorias de eventos  
- `003_create_user_profiles.sql` - Perfis de usuários
- `004_create_events.sql` - Tabela principal de eventos

✅ **Seeds:**
- `001_categories.sql` - Categorias iniciais (Musical, Forró, Gospel, etc.)

✅ **Scripts:**
- `setup_local.ps1` - Setup automático
- `.env` - Configurações de desenvolvimento

## 🔧 Configurações

**Database:** `eventos_garanhuns_dev`
**Usuário:** `eventos_user`
**Senha:** `eventos_dev_2025`
**String de conexão:** `postgresql://eventos_user:eventos_dev_2025@localhost:5432/eventos_garanhuns_dev`

## 🆘 Problemas Comuns

**"psql não reconhecido"**
- PostgreSQL não foi instalado ou não está no PATH
- Reinicie o PowerShell após instalar

**"Erro de conexão"**
- Verifique se o serviço PostgreSQL está rodando
- Confirme a senha do postgres

**"Permissão negada"**
- Execute PowerShell como Administrador

## 📞 Documentação Completa

Consulte `database/README.md` para documentação detalhada.

---

**🎯 Execute apenas:** `.\database\scripts\setup_local.ps1` 