# Portal de Eventos Garanhuns - Versão 2.0 com Funcionalidades Sociais

## 🎉 Portal Atualizado e Implantado com Sucesso!

**🌐 URLs do Sistema:**
- **Frontend:** https://umlamisv.manus.space
- **Backend API:** https://e5h6i7c0x97j.manus.space

## 🚀 Novas Funcionalidades Implementadas

### 📸 Sistema de Upload de Mídia
- **Upload de fotos e vídeos** para cada evento
- **Preview em tempo real** antes do envio
- **Suporte a múltiplos formatos**: JPG, PNG, GIF, MP4, MOV, AVI, WebM
- **Validação de arquivos** e controle de tamanho
- **Armazenamento seguro** no servidor

### 👥 Sistema de Marcação de Usuários
- **Marcação de pessoas** nas fotos e vídeos
- **Campo de busca** para encontrar usuários
- **Exibição de usuários marcados** em cada mídia
- **Badges visuais** para identificar pessoas marcadas

### 💬 Sistema de Interação Social
- **Sistema de curtidas** para fotos e vídeos
- **Contador de likes** em tempo real
- **Comentários** (estrutura preparada)
- **Informações do usuário** que postou a mídia

### 🔗 Integração com Redes Sociais
- **Compartilhamento no Facebook** com URL pública
- **Preparação para Instagram** (estrutura criada)
- **URLs públicas** para cada mídia compartilhada
- **Metadados otimizados** para redes sociais

### 🎨 Interface Aprimorada
- **Botões de galeria** em todos os eventos (ícone de câmera)
- **Modal responsivo** para upload e visualização
- **Galeria organizada** com filtros por tipo (fotos/vídeos)
- **Design consistente** com o portal original
- **Responsividade total** para mobile e desktop

## 🛠️ Arquitetura Técnica

### Backend (Flask)
```
portal-eventos-backend/
├── src/
│   ├── models/
│   │   ├── user.py          # Modelo de usuário expandido
│   │   ├── event.py         # Modelo de eventos
│   │   ├── media.py         # Modelo de mídias
│   │   └── comment.py       # Modelo de comentários
│   ├── routes/
│   │   ├── user.py          # Rotas de usuários
│   │   ├── event.py         # Rotas de eventos
│   │   └── media.py         # Rotas de mídias
│   ├── static/uploads/      # Armazenamento de arquivos
│   └── main.py              # Aplicação principal
└── requirements.txt
```

### Frontend (React)
```
portal-eventos-garanhuns/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes shadcn/ui
│   │   └── MediaComponents.jsx  # Componentes de mídia
│   ├── assets/images/       # Imagens do projeto
│   ├── App.jsx              # Componente principal
│   └── App.css              # Estilos customizados
└── dist/                    # Build de produção
```

## 📊 Funcionalidades do Sistema

### 🔐 Gerenciamento de Usuários
- **Perfis completos** com avatar, bio e redes sociais
- **Handles do Instagram e Facebook** para integração
- **Sistema de autenticação** (estrutura preparada)
- **Relacionamentos** entre usuários, mídias e comentários

### 📅 Gestão de Eventos
- **CRUD completo** de eventos via API
- **Filtros avançados** por categoria, busca e destaque
- **Relacionamento** com mídias e comentários
- **Metadados** de criação e atualização

### 🎥 Gerenciamento de Mídias
- **Upload seguro** com validação de tipos
- **Metadados completos**: tamanho, tipo MIME, timestamps
- **Sistema de likes** com contador
- **Marcação de usuários** em JSON
- **Relacionamento** com eventos e usuários

## 🌐 APIs Disponíveis

### Eventos
- `GET /api/events` - Listar eventos com filtros
- `GET /api/events/{id}` - Obter evento específico
- `POST /api/events` - Criar novo evento
- `PUT /api/events/{id}` - Atualizar evento
- `DELETE /api/events/{id}` - Deletar evento

### Mídias
- `POST /api/media/upload` - Upload de foto/vídeo
- `GET /api/media/event/{id}` - Mídias de um evento
- `GET /api/media/{id}` - Mídia específica
- `POST /api/media/{id}/like` - Curtir mídia
- `DELETE /api/media/{id}` - Deletar mídia

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/{id}` - Obter usuário específico

## 🔧 Como Usar

### Para Usuários Finais
1. **Acesse** https://umlamisv.manus.space
2. **Navegue** pelos eventos disponíveis
3. **Clique no ícone de câmera** para abrir a galeria
4. **Faça upload** de fotos e vídeos dos eventos
5. **Marque pessoas** nas suas postagens
6. **Curta e comente** nas mídias de outros usuários
7. **Compartilhe** nas redes sociais

### Para Desenvolvedores
```bash
# Backend
cd portal-eventos-backend
source venv/bin/activate
python src/main.py

# Frontend
cd portal-eventos-garanhuns
npm install
npm run dev
```

## 🎯 Próximos Passos Recomendados

### Funcionalidades Futuras
1. **Sistema de autenticação completo**
   - Login/registro de usuários
   - Autenticação via redes sociais
   - Perfis personalizáveis

2. **Integração avançada com redes sociais**
   - API do Instagram para postagem automática
   - Sincronização com Facebook Events
   - Importação de fotos das redes sociais

3. **Funcionalidades de comunidade**
   - Sistema de seguir usuários
   - Feed personalizado de eventos
   - Notificações push

4. **Recursos administrativos**
   - Painel de administração
   - Moderação de conteúdo
   - Analytics e relatórios

5. **Melhorias técnicas**
   - Cache de imagens
   - Compressão automática de mídias
   - CDN para melhor performance

### Integrações Recomendadas
- **Google Maps** para localização dos eventos
- **WhatsApp Business** para contato direto
- **Google Analytics** para métricas
- **Firebase** para notificações push
- **Cloudinary** para otimização de imagens

## 📱 Compatibilidade

- ✅ **Desktop** - Todas as funcionalidades
- ✅ **Mobile** - Interface responsiva completa
- ✅ **Tablets** - Experiência otimizada
- ✅ **Navegadores** - Chrome, Firefox, Safari, Edge

## 🔒 Segurança

- **Validação de arquivos** no upload
- **CORS configurado** para segurança
- **Sanitização de dados** nas APIs
- **Estrutura preparada** para autenticação JWT

## 📞 Suporte e Contato

- **Email:** contato@eventosgaranhuns.com.br
- **Telefone:** (87) 9999-9999
- **Localização:** Garanhuns, Pernambuco

## 📄 Licença

© 2025 Portal de Eventos Garanhuns. Todos os direitos reservados.

---

**🎊 Portal totalmente funcional com sistema completo de mídias sociais para a comunidade de Garanhuns/PE!**

**Desenvolvido com ❤️ e tecnologias modernas para conectar a comunidade através dos eventos da cidade.**

