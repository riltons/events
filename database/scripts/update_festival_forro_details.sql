-- Script para Atualizar Detalhes do Festival de Forró de Garanhuns 2025
-- Portal de Eventos Garanhuns
-- Data: 2025-01-26

UPDATE events 
SET 
    description = 'O Festival de Forró de Garanhuns 2025 é o maior evento musical do agreste pernambucano, reunindo as maiores estrelas do forró nacional e regional em 6 dias de muita música, dança e tradição nordestina. 

🎵 PROGRAMAÇÃO COMPLETA:

📅 TERÇA-FEIRA (15/07) - ABERTURA OFICIAL
19h - Abertura com Banda Municipal de Garanhuns
20h - Elba Ramalho - Show de Abertura
22h30 - Alceu Valença - Participação Especial

📅 QUARTA-FEIRA (16/07) - NOITE DOS CLÁSSICOS
19h - Quadrilhas Tradicionais de Garanhuns
20h30 - Dominguinhos Jr.
22h - Falamansa
23h30 - Trio Virgulino

📅 QUINTA-FEIRA (17/07) - FORRÓ UNIVERSITÁRIO
19h - Shows locais e regionais
21h - Mastruz com Leite
22h30 - Aviões do Forró
00h - Garota Safada

📅 SEXTA-FEIRA (18/07) - GRANDE NOITE
19h - Concurso de Quadrilhas (Final)
21h - Solange Almeida
22h30 - Wesley Safadão
00h30 - Xand Avião

📅 SÁBADO (19/07) - FESTIVAL KIDS + NOITE PRINCIPAL
14h - Festival Kids com oficinas de dança
16h - Shows infantis
19h - Banda Calypso
20h30 - Calcinha Preta
22h - Gusttavo Lima (Participação Especial)
00h - Shows regionais

📅 DOMINGO (20/07) - ENCERRAMENTO TRADICIONAL
15h - Forró Pé de Serra com sanfoneiros locais
17h - Grupo Tradição
19h - Luiz Gonzaga Jr. (Gonzaguinha Cover)
21h - Show de Encerramento com todos os artistas

🎪 ATRAÇÕES ESPECIAIS:
• Vila do Forró - Espaço gastronômico com comidas típicas
• Museu Itinerante do Forró
• Oficinas de dança e sanfona
• Feira de artesanato local
• Espaço Kids com monitores
• Arena de quadrilhas

🎯 CONCURSOS:
• Melhor Quadrilha Tradicional - Prêmio: R$ 15.000
• Rei e Rainha do Forró - Prêmio: R$ 5.000
• Melhor Sanfoneiro Mirim - Prêmio: R$ 2.000',

    address = '{
        "street": "Rua José Mariano, s/n",
        "neighborhood": "Centro",
        "city": "Garanhuns",
        "state": "PE",
        "zipcode": "55295-000",
        "complement": "Parque Ruber van der Linden",
        "reference": "Próximo ao Hospital Régis Pacheco"
    }',
    
    location_coordinates = POINT(-36.4927, -8.8932),
    
    location_instructions = 'O Parque Ruber van der Linden fica localizado no centro de Garanhuns. Acesso principal pela Rua José Mariano. Estacionamento gratuito disponível nas ruas adjacentes. Transporte público gratuito durante o evento a partir das 17h.',
    
    organizer_info = '{
        "name": "Prefeitura Municipal de Garanhuns",
        "department": "Secretaria de Cultura e Turismo",
        "responsible": "João Carlos Silva",
        "position": "Secretário de Cultura",
        "email": "cultura@garanhuns.pe.gov.br",
        "phone": "(87) 3761-4000",
        "whatsapp": "(87) 99999-9999"
    }',
    
    contact_info = '{
        "primary_phone": "(87) 3761-4000",
        "whatsapp": "(87) 99999-9999",
        "email": "festival@garanhuns.pe.gov.br",
        "emergency_phone": "(87) 99888-7777",
        "press_contact": {
            "name": "Maria Fernanda Santos",
            "email": "imprensa@garanhuns.pe.gov.br",
            "phone": "(87) 99777-6666"
        }
    }',
    
    social_links = '{
        "instagram": "@festivaldeferrogaranhuns",
        "facebook": "Festival de Forró de Garanhuns",
        "youtube": "Festival Forró Garanhuns Oficial",
        "tiktok": "@festivaldeferrogaranhuns",
        "website": "https://festivaldeforro.garanhuns.pe.gov.br"
    }',
    
    accessibility_info = '{
        "wheelchair_accessible": true,
        "sign_language": true,
        "audio_description": true,
        "accessible_parking": true,
        "accessible_bathrooms": true,
        "guide_dog_allowed": true,
        "priority_entrance": true,
        "accessibility_contact": "(87) 99666-5555"
    }',
    
    ticket_info = '{
        "free_event": true,
        "requirements": "Não é necessário retirar ingresso",
        "capacity_limit": "Evento gratuito com capacidade limitada",
        "age_restriction": "Livre para todas as idades",
        "special_areas": {
            "vip_area": "Área VIP para autoridades e imprensa",
            "accessibility_area": "Área reservada para pessoas com deficiência",
            "family_area": "Área família próxima ao palco kids"
        }
    }',
    
    sponsors = ARRAY[
        '{"name": "Governo do Estado de Pernambuco", "type": "government", "logo": ""}'::jsonb,
        '{"name": "Ministério do Turismo", "type": "federal", "logo": ""}'::jsonb,
        '{"name": "Banco do Nordeste", "type": "sponsor", "logo": ""}'::jsonb,
        '{"name": "Cerveja Brahma", "type": "sponsor", "logo": ""}'::jsonb,
        '{"name": "Rádio Jornal Garanhuns", "type": "media", "logo": ""}'::jsonb
    ],
    
    tags = ARRAY['forró', 'música', 'tradição', 'nordeste', 'festival', 'cultura', 'gratuito', 'garanhuns'],
    
    keywords = ARRAY['festival de forró', 'garanhuns', 'elba ramalho', 'alceu valença', 'wesley safadão', 'música nordestina', 'evento gratuito', 'pernambuco'],
    
    capacity = 15000,
    min_age = NULL,
    max_age = NULL,
    
    meta_title = 'Festival de Forró de Garanhuns 2025 | 15 a 20 de Julho | Entrada Gratuita',
    meta_description = 'O maior festival de forró do agreste pernambucano. Elba Ramalho, Alceu Valença, Wesley Safadão e muito mais. De 15 a 20 de julho no Parque Ruber van der Linden. Entrada gratuita!',
    
    external_links = '{
        "spotify_playlist": "https://open.spotify.com/playlist/festival-forro-garanhuns",
        "youtube_channel": "https://youtube.com/festivaldeferrogaranhuns",
        "live_stream": "https://youtube.com/live/festivaldeferrogaranhuns",
        "photos_2024": "https://flickr.com/festival-forro-garanhuns-2024"
    }',
    
    dress_code = 'Casual/Esportivo - Roupas confortáveis recomendadas',
    
    allow_media_upload = true,
    allow_comments = true,
    allow_reviews = true,
    require_approval_for_media = false,
    
    fixado = true,
    
    updated_at = NOW()

WHERE slug = 'festival-forro-garanhuns-2025';

-- Verificar se a atualização foi bem-sucedida
SELECT 
    title,
    venue_name,
    start_date,
    end_date,
    capacity,
    address->>'street' as endereco,
    organizer_info->>'name' as organizador,
    contact_info->>'email' as email_contato
FROM events 
WHERE slug = 'festival-forro-garanhuns-2025'; 