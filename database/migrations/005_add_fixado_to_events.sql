-- Migração 005: Adicionar campo 'fixado' para evento em destaque
-- Portal de Eventos Garanhuns

-- Adicionar coluna fixado na tabela events
ALTER TABLE events 
ADD COLUMN fixado BOOLEAN DEFAULT FALSE;

-- Criar índice para consultas rápidas de eventos fixados
CREATE INDEX idx_events_fixado ON events(fixado) WHERE fixado = TRUE;

-- Comentário na coluna
COMMENT ON COLUMN events.fixado IS 'Indica se o evento deve ser exibido como fixado/destaque na página principal';

-- Constraint para garantir que apenas um evento seja fixado por vez (opcional)
-- Vamos permitir múltiplos fixados por flexibilidade

-- Atualizar um evento existente como exemplo (opcional)
-- UPDATE events SET fixado = TRUE WHERE slug = 'festival-forro-garanhuns-2025' LIMIT 1; 