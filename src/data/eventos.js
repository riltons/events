// Dados dos eventos baseados no calendário oficial de Garanhuns 2025
export const eventosData = [
  {
    id: 1,
    titulo: "Desfile das Virgens",
    data: "2025-02-28",
    local: "Centro de Garanhuns",
    categoria: "Religioso",
    tipo: "publico",
    descricao: "Tradicional desfile religioso que marca o início do calendário cultural da cidade.",
    imagem: "/images/eventos/desfile-virgens.jpg",
    destaque: true,
    preco: "Gratuito",
    organizador: "Prefeitura de Garanhuns",
    status: "programado", // programado, em_andamento, finalizado
    programacao: [
      {
        horario: "14:00",
        atividade: "Concentração na Praça Souto Filho",
        local: "Praça Souto Filho"
      },
      {
        horario: "15:00",
        atividade: "Início do Desfile das Virgens",
        local: "Rua Santo Antônio"
      },
      {
        horario: "17:00",
        atividade: "Chegada na Igreja do Rosário",
        local: "Igreja do Rosário"
      }
    ],
    locais: [
      {
        nome: "Praça Souto Filho",
        endereco: "Centro, Garanhuns - PE",
        tipo: "concentracao"
      },
      {
        nome: "Rua Santo Antônio",
        endereco: "Centro, Garanhuns - PE", 
        tipo: "percurso"
      },
      {
        nome: "Igreja do Rosário",
        endereco: "Rua do Rosário, Centro, Garanhuns - PE",
        tipo: "destino"
      }
    ],
    noticias: [
      {
        titulo: "Desfile das Virgens abre calendário cultural 2025",
        resumo: "Tradicional evento religioso marca início dos festivais",
        data: "2025-02-20"
      }
    ],
    informacoes: {
      duracao: "3 horas",
      publico_esperado: "5.000 pessoas",
      restricoes: "Evento familiar, sem restrições de idade",
      acessibilidade: "Percurso acessível para cadeirantes",
      estacionamento: "Disponível na Praça da Bandeira",
      transporte_publico: "Linhas 1, 2 e 3 passam pelo centro"
    }
  },
  {
    id: 2,
    titulo: "Jazz Festival e Carnaval dos Bairros",
    data: "2025-03-01",
    dataFim: "2025-03-04",
    local: "Diversos locais",
    categoria: "Musical",
    tipo: "publico",
    descricao: "Festival de jazz e carnaval que anima os bairros da cidade.",
    imagem: "/images/eventos/jazz-festival.jpg",
    destaque: true,
    preco: "Gratuito",
    organizador: "Prefeitura de Garanhuns",
    status: "em_andamento",
    programacao: [
      {
        horario: "19:00",
        atividade: "Abertura com Banda de Jazz Local",
        local: "Praça Mestre Dominguinhos",
        dia: "01/03"
      },
      {
        horario: "21:00",
        atividade: "Show Principal - Quinteto Jazz Brasil",
        local: "Praça Mestre Dominguinhos",
        dia: "01/03"
      },
      {
        horario: "14:00",
        atividade: "Carnaval dos Bairros - Heliópolis",
        local: "Ruas do Bairro Heliópolis",
        dia: "02/03"
      },
      {
        horario: "16:00",
        atividade: "Carnaval dos Bairros - Santo Antônio",
        local: "Ruas do Bairro Santo Antônio",
        dia: "02/03"
      },
      {
        horario: "20:00",
        atividade: "Noite do Jazz - Tributo a Miles Davis",
        local: "Teatro Guarany",
        dia: "03/03"
      },
      {
        horario: "15:00",
        atividade: "Encerramento com Desfile de Blocos",
        local: "Av. Rui Barbosa",
        dia: "04/03"
      }
    ],
    locais: [
      {
        nome: "Praça Mestre Dominguinhos",
        endereco: "Centro, Garanhuns - PE",
        tipo: "palco_principal"
      },
      {
        nome: "Teatro Guarany",
        endereco: "Rua Aprígio Guimarães, Centro",
        tipo: "show_especial"
      },
      {
        nome: "Bairro Heliópolis",
        endereco: "Heliópolis, Garanhuns - PE",
        tipo: "carnaval_bairro"
      },
      {
        nome: "Bairro Santo Antônio",
        endereco: "Santo Antônio, Garanhuns - PE",
        tipo: "carnaval_bairro"
      }
    ],
    noticias: [
      {
        titulo: "Jazz Festival 2025 traz grandes nomes da música brasileira",
        resumo: "Quinteto Jazz Brasil e tributos especiais na programação",
        data: "2025-02-25",
        imagem: "/images/noticias/jazz-festival-2025.jpg",
        destaque: true
      },
      {
        titulo: "Carnaval dos Bairros mobiliza comunidades locais",
        resumo: "Blocos tradicionais se preparam para desfiles",
        data: "2025-02-28",
        imagem: "/images/noticias/carnaval-bairros.jpg",
        destaque: true
      },
      {
        titulo: "Programação completa do Jazz Festival é divulgada",
        resumo: "4 dias de música com artistas locais e nacionais",
        data: "2025-02-20",
        imagem: "/images/noticias/programacao-jazz.jpg",
        destaque: false
      }
    ],
    informacoes: {
      duracao: "4 dias",
      publico_esperado: "15.000 pessoas",
      restricoes: "Eventos noturnos recomendados para maiores de 12 anos",
      acessibilidade: "Todos os locais possuem acesso para cadeirantes",
      estacionamento: "Múltiplos pontos disponíveis em cada local",
      transporte_publico: "Linhas especiais durante o festival"
    }
  },
  {
    id: 3,
    titulo: "Viva Garanhuns",
    data: "2025-05-01",
    dataFim: "2025-05-04",
    local: "Parque Euclides Dourado",
    categoria: "Forró",
    tipo: "publico",
    descricao: "O maior São João do Nordeste com grandes nomes do forró.",
    imagem: "/images/eventos/viva-garanhuns.jpg",
    destaque: true,
    preco: "Gratuito",
    organizador: "Prefeitura de Garanhuns",
    status: "programado",
    programacao: [
      {
        horario: "18:00",
        atividade: "Abertura com Quadrilhas Juninas",
        local: "Palco Principal",
        dia: "01/05"
      },
      {
        horario: "20:00",
        atividade: "Elba Ramalho",
        local: "Palco Principal",
        dia: "01/05"
      },
      {
        horario: "22:30",
        atividade: "Alcymar Monteiro",
        local: "Palco Principal",
        dia: "01/05"
      },
      {
        horario: "19:00",
        atividade: "Falamansa",
        local: "Palco Principal",
        dia: "02/05"
      },
      {
        horario: "21:00",
        atividade: "Dominguinhos do Acordeon",
        local: "Palco Principal",
        dia: "02/05"
      },
      {
        horario: "23:00",
        atividade: "Trio Nordestino",
        local: "Palco Principal",
        dia: "02/05"
      }
    ],
    locais: [
      {
        nome: "Parque Euclides Dourado",
        endereco: "Av. Euclides Dourado, Garanhuns - PE",
        tipo: "local_principal"
      },
      {
        nome: "Palco Principal",
        endereco: "Centro do Parque Euclides Dourado",
        tipo: "palco_shows"
      },
      {
        nome: "Vila Gastronômica",
        endereco: "Lateral do Parque",
        tipo: "alimentacao"
      },
      {
        nome: "Espaço Kids",
        endereco: "Área Norte do Parque",
        tipo: "entretenimento_infantil"
      }
    ],
    noticias: [
      {
        titulo: "Viva Garanhuns 2025 confirma Elba Ramalho e grandes atrações",
        resumo: "Maior São João do Nordeste terá 4 dias de festa",
        data: "2025-04-15",
        imagem: "/images/noticias/viva-garanhuns-2025.jpg",
        destaque: true
      },
      {
        titulo: "Estrutura do Viva Garanhuns será a maior da história",
        resumo: "Parque Euclides Dourado recebe melhorias para o evento",
        data: "2025-04-20",
        imagem: "/images/noticias/estrutura-viva-garanhuns.jpg",
        destaque: true
      },
      {
        titulo: "Ingressos para camarotes do Viva Garanhuns já estão à venda",
        resumo: "Vendas começaram com desconto especial para primeiros compradores",
        data: "2025-04-10",
        imagem: "/images/noticias/ingressos-viva-garanhuns.jpg",
        destaque: true
      },
      {
        titulo: "Quadrilhas juninas se preparam para abertura do Viva Garanhuns",
        resumo: "Mais de 20 quadrilhas participarão da cerimônia de abertura",
        data: "2025-04-25",
        imagem: "/images/noticias/quadrilhas-viva-garanhuns.jpg",
        destaque: false
      }
    ],
    informacoes: {
      duracao: "4 dias",
      publico_esperado: "80.000 pessoas",
      restricoes: "Proibido entrada de bebidas e objetos cortantes",
      acessibilidade: "Área especial para cadeirantes próxima ao palco",
      estacionamento: "Estacionamentos gratuitos nos arredores",
      transporte_publico: "Ônibus especiais saindo do centro da cidade"
    }
  },
  {
    id: 4,
    titulo: "Santo Antônio",
    data: "2025-06-01",
    dataFim: "2025-06-14",
    local: "Centro da cidade",
    categoria: "Religioso",
    tipo: "publico",
    descricao: "Festividades em homenagem a Santo Antônio com programação religiosa e cultural.",
    imagem: "/images/eventos/santo-antonio.jpg",
    destaque: false,
    preco: "Gratuito",
    organizador: "Prefeitura de Garanhuns",
    status: "programado",
    programacao: [
      {
        horario: "06:00",
        atividade: "Alvorada Festiva",
        local: "Igreja de Santo Antônio",
        dia: "Diário"
      },
      {
        horario: "19:00",
        atividade: "Novena de Santo Antônio",
        local: "Igreja de Santo Antônio",
        dia: "Diário"
      },
      {
        horario: "20:00",
        atividade: "Apresentações Culturais",
        local: "Praça da Igreja",
        dia: "Fins de semana"
      }
    ],
    locais: [
      {
        nome: "Igreja de Santo Antônio",
        endereco: "Rua Santo Antônio, Centro",
        tipo: "local_religioso"
      },
      {
        nome: "Praça da Igreja",
        endereco: "Em frente à Igreja de Santo Antônio",
        tipo: "eventos_culturais"
      }
    ],
    noticias: [
      {
        titulo: "Festividades de Santo Antônio começam em junho",
        resumo: "14 dias de programação religiosa e cultural",
        data: "2025-05-25"
      }
    ],
    informacoes: {
      duracao: "14 dias",
      publico_esperado: "25.000 pessoas",
      restricoes: "Respeitar silêncio durante celebrações religiosas",
      acessibilidade: "Igreja possui rampa de acesso",
      estacionamento: "Limitado, recomenda-se ir a pé",
      transporte_publico: "Todas as linhas passam pelo centro"
    }
  },
  {
    id: 5,
    titulo: "Festival Gospel",
    data: "2025-12-28",
    dataFim: "2026-01-05",
    local: "Parque Euclides Dourado",
    categoria: "Gospel",
    tipo: "publico",
    descricao: "Festival de música gospel com grandes artistas nacionais.",
    imagem: "/images/eventos/festival-gospel.jpg",
    destaque: false,
    preco: "Gratuito",
    organizador: "Prefeitura de Garanhuns",
    status: "programado",
    programacao: [
      {
        horario: "19:00",
        atividade: "Abertura com Coral Local",
        local: "Palco Principal",
        dia: "28/12"
      },
      {
        horario: "20:30",
        atividade: "Aline Barros",
        local: "Palco Principal",
        dia: "28/12"
      },
      {
        horario: "19:00",
        atividade: "Fernandinho",
        local: "Palco Principal",
        dia: "29/12"
      },
      {
        horario: "20:30",
        atividade: "Cassiane",
        local: "Palco Principal",
        dia: "30/12"
      },
      {
        horario: "19:30",
        atividade: "André Valadão",
        local: "Palco Principal",
        dia: "31/12"
      },
      {
        horario: "20:00",
        atividade: "Diante do Trono",
        local: "Palco Principal",
        dia: "01/01"
      },
      {
        horario: "19:00",
        atividade: "Thalles Roberto",
        local: "Palco Principal",
        dia: "02/01"
      },
      {
        horario: "20:30",
        atividade: "Encerramento com Bruna Karla",
        local: "Palco Principal",
        dia: "05/01"
      }
    ],
    locais: [
      {
        nome: "Parque Euclides Dourado",
        endereco: "Av. Euclides Dourado, Garanhuns - PE",
        tipo: "local_principal"
      }
    ],
    noticias: [
      {
        titulo: "Festival Gospel 2025/2026 bate recorde de inscrições antecipadas",
        resumo: "Mais de 30 mil pessoas já confirmaram presença para a abertura com Aline Barros. Expectativa é receber 50 mil pessoas durante os 9 dias de evento.",
        data: "2025-12-20",
        categoria: "Festival",
        autor: "Redação Portal",
        destaque: true,
        imagem: "/images/noticias/festival-gospel-inscricoes.jpg"
      },
      {
        titulo: "Diante do Trono confirma participação especial no Festival Gospel",
        resumo: "Banda mineira fará show único no dia 1º de janeiro, trazendo sucessos como 'Quão Grande é o Meu Deus' e novidades do último álbum.",
        data: "2025-12-18",
        categoria: "Festival",
        autor: "Redação Portal",
        destaque: true,
        imagem: "/images/noticias/diante-do-trono-confirmado.jpg"
      },
      {
        titulo: "Festival Gospel terá área kids e ministração especial",
        resumo: "Pela primeira vez, o evento contará com espaço dedicado às crianças e momentos de oração e ministração entre os shows.",
        data: "2025-12-15",
        categoria: "Festival",
        autor: "Redação Portal",
        destaque: true,
        imagem: "/images/noticias/festival-gospel-novidades.jpg"
      },
      {
        titulo: "Cassiane promete repertório especial para Garanhuns",
        resumo: "A 'Rainha do Gospel' preparou setlist exclusivo com clássicos e músicas inéditas para sua apresentação no dia 30 de dezembro.",
        data: "2025-12-12",
        categoria: "Festival",
        autor: "Redação Portal",
        destaque: true,
        imagem: "/images/noticias/cassiane-repertorio-especial.jpg"
      },
      {
        titulo: "Estrutura do Festival Gospel é montada no Parque Euclides Dourado",
        resumo: "Equipes trabalham 24h na montagem do palco principal que terá 40 metros de largura e sistema de som de última geração.",
        data: "2025-12-10",
        categoria: "Festival",
        autor: "Redação Portal",
        destaque: false,
        imagem: "/images/noticias/montagem-estrutura-gospel.jpg"
      }
    ],
    informacoes: {
      duracao: "9 dias",
      publico_esperado: "50.000 pessoas",
      restricoes: "Evento familiar",
      acessibilidade: "Área especial para cadeirantes",
      estacionamento: "Disponível nos arredores",
      transporte_publico: "Linhas especiais durante o festival"
    }
  },
  {
    id: 6,
    titulo: "Festival de Inverno de Garanhuns (FIG)",
    data: "2025-07-10",
    dataFim: "2025-07-27",
    local: "Diversos locais",
    categoria: "Musical",
    tipo: "publico",
    descricao: "O tradicional Festival de Inverno com 35 anos de história e grandes shows.",
    imagem: "/images/eventos/fig.jpg",
    destaque: true,
    preco: "Gratuito",
    organizador: "Prefeitura de Garanhuns",
    status: "programado",
    programacao: [
      {
        horario: "20:00",
        atividade: "Abertura com Orquestra Sinfônica",
        local: "Teatro Guarany",
        dia: "10/07"
      },
      {
        horario: "21:30",
        atividade: "Gilberto Gil",
        local: "Parque Euclides Dourado",
        dia: "12/07"
      },
      {
        horario: "20:00",
        atividade: "Maria Bethânia",
        local: "Parque Euclides Dourado",
        dia: "15/07"
      },
      {
        horario: "19:00",
        atividade: "Caetano Veloso",
        local: "Parque Euclides Dourado",
        dia: "20/07"
      },
      {
        horario: "21:00",
        atividade: "Encerramento com Ivete Sangalo",
        local: "Parque Euclides Dourado",
        dia: "27/07"
      }
    ],
    locais: [
      {
        nome: "Parque Euclides Dourado",
        endereco: "Av. Euclides Dourado, Garanhuns - PE",
        tipo: "palco_principal"
      },
      {
        nome: "Teatro Guarany",
        endereco: "Rua Aprígio Guimarães, Centro",
        tipo: "shows_especiais"
      },
      {
        nome: "Polo Gastronômico",
        endereco: "Centro da cidade",
        tipo: "gastronomia"
      }
    ],
    noticias: [
      {
        titulo: "FIG 2025: 35 anos de história com lineup dos sonhos confirmado",
        resumo: "Gilberto Gil, Maria Bethânia, Caetano Veloso e Ivete Sangalo fazem parte da programação especial de aniversário do festival mais tradicional do Nordeste.",
        data: "2025-06-01",
        categoria: "Festival",
        autor: "Redação Portal",
        destaque: true,
        imagem: "/images/noticias/fig-35-anos-lineup.jpg"
      },
      {
        titulo: "Ingressos para shows principais do FIG esgotam em tempo recorde",
        resumo: "Shows de Gilberto Gil e Maria Bethânia tiveram todos os ingressos vendidos em apenas 2 horas. Organização anuncia segunda leva de vendas.",
        data: "2025-06-15",
        categoria: "Festival",
        autor: "Redação Portal",
        destaque: true,
        imagem: "/images/noticias/fig-ingressos-esgotados.jpg"
      },
      {
        titulo: "Teatro Guarany será restaurado especialmente para o FIG 2025",
        resumo: "Investimento de R$ 2 milhões em reforma do histórico teatro garante apresentações em local totalmente renovado, com melhor acústica e acessibilidade.",
        data: "2025-05-20",
        categoria: "Festival",
        autor: "Redação Portal",
        destaque: true,
        imagem: "/images/noticias/teatro-guarany-reforma.jpg"
      },
      {
        titulo: "FIG 2025 terá polo gastronômico com 50 estabelecimentos",
        resumo: "Maior edição gastronômica da história do festival contará com pratos típicos nordestinos e culinária internacional, além de espaço para food trucks.",
        data: "2025-05-25",
        categoria: "Festival",
        autor: "Redação Portal",
        destaque: true,
        imagem: "/images/noticias/fig-polo-gastronomico.jpg"
      },
      {
        titulo: "Caetano Veloso fará show especial no encerramento do FIG",
        resumo: "O maestro da MPB preparou setlist exclusivo com clássicos e parcerias inéditas para o grande encerramento do festival no dia 27 de julho.",
        data: "2025-06-10",
        categoria: "Festival",
        autor: "Redação Portal",
        destaque: true,
        imagem: "/images/noticias/caetano-fig-especial.jpg"
      }
    ],
    informacoes: {
      duracao: "18 dias",
      publico_esperado: "200.000 pessoas",
      restricoes: "Alguns shows com classificação etária",
      acessibilidade: "Todos os locais adaptados",
      estacionamento: "Múltiplos pontos pela cidade",
      transporte_publico: "Sistema especial durante o festival"
    }
  },
  {
    id: 7,
    titulo: "Viva Jesus",
    data: "2025-09-25",
    dataFim: "2025-09-28",
    local: "Centro da cidade",
    categoria: "Religioso",
    tipo: "publico",
    descricao: "Festival religioso com programação especial.",
    imagem: "/images/eventos/viva-jesus.jpg",
    destaque: false,
    preco: "Gratuito",
    organizador: "Prefeitura de Garanhuns",
    status: "programado",
    programacao: [
      {
        horario: "19:00",
        atividade: "Abertura com Procissão",
        local: "Igreja Matriz",
        dia: "25/09"
      },
      {
        horario: "20:00",
        atividade: "Show Gospel",
        local: "Praça da Bandeira",
        dia: "26/09"
      }
    ],
    locais: [
      {
        nome: "Igreja Matriz",
        endereco: "Centro, Garanhuns - PE",
        tipo: "local_religioso"
      },
      {
        nome: "Praça da Bandeira",
        endereco: "Centro, Garanhuns - PE",
        tipo: "shows"
      }
    ],
    noticias: [
      {
        titulo: "Viva Jesus 2025 terá programação especial",
        resumo: "4 dias de celebrações religiosas e culturais",
        data: "2025-09-10"
      }
    ],
    informacoes: {
      duracao: "4 dias",
      publico_esperado: "30.000 pessoas",
      restricoes: "Evento familiar",
      acessibilidade: "Locais com acesso adaptado",
      estacionamento: "Disponível no centro",
      transporte_publico: "Todas as linhas atendem o centro"
    }
  },
  {
    id: 8,
    titulo: "Encantos do Natal",
    data: "2025-10-31",
    dataFim: "2026-01-11",
    local: "Centro de Garanhuns",
    categoria: "Natalino",
    tipo: "publico",
    descricao: "Decoração natalina e programação especial para as festividades de fim de ano.",
    imagem: "/images/eventos/encantos-natal.jpg",
    destaque: true,
    preco: "Gratuito",
    organizador: "Prefeitura de Garanhuns",
    status: "programado",
    programacao: [
      {
        horario: "19:00",
        atividade: "Acendimento das Luzes de Natal",
        local: "Praça da Bandeira",
        dia: "31/10"
      },
      {
        horario: "20:00",
        atividade: "Show de Natal",
        local: "Praça da Bandeira",
        dia: "Fins de semana"
      },
      {
        horario: "18:00",
        atividade: "Chegada do Papai Noel",
        local: "Centro da cidade",
        dia: "15/12"
      },
      {
        horario: "23:00",
        atividade: "Reveillon 2026",
        local: "Praça da Bandeira",
        dia: "31/12"
      }
    ],
    locais: [
      {
        nome: "Praça da Bandeira",
        endereco: "Centro, Garanhuns - PE",
        tipo: "decoracao_principal"
      },
      {
        nome: "Rua Santo Antônio",
        endereco: "Centro, Garanhuns - PE",
        tipo: "decoracao_ruas"
      },
      {
        nome: "Parque da Criança",
        endereco: "Centro, Garanhuns - PE",
        tipo: "atividades_infantis"
      }
    ],
    noticias: [
      {
        titulo: "Encantos do Natal 2025 promete ser o maior da história",
        resumo: "Decoração especial e programação até janeiro",
        data: "2025-10-15"
      }
    ],
    informacoes: {
      duracao: "73 dias",
      publico_esperado: "100.000 pessoas",
      restricoes: "Evento familiar",
      acessibilidade: "Todo o centro adaptado",
      estacionamento: "Múltiplos pontos no centro",
      transporte_publico: "Todas as linhas atendem o centro"
    }
  },
  // Eventos de Fim de Semana
  {
    id: 9,
    titulo: "Noite do Forró - Bar do João",
    data: "2025-06-28",
    dataFim: null,
    local: "Bar do João",
    categoria: "Forró",
    tipo: "privado",
    descricao: "Noite especial de forró com banda ao vivo e muito pé de serra.",
    imagem: "/images/eventos/noite-forro.jpg",
    destaque: false,
    preco: "R$ 15,00",
    organizador: "Bar do João",
    status: "programado",
    horario: "21:00",
    programacao: [
      {
        horario: "21:00",
        atividade: "Abertura com DJ",
        local: "Bar do João"
      },
      {
        horario: "22:00",
        atividade: "Trio Pé de Serra",
        local: "Bar do João"
      }
    ],
    locais: [
      {
        nome: "Bar do João",
        endereco: "Rua das Flores, 123, Centro",
        tipo: "bar"
      }
    ],
    informacoes: {
      duracao: "1 noite",
      publico_esperado: "150 pessoas",
      restricoes: "Proibido para menores de 18 anos",
      acessibilidade: "Acesso limitado",
      estacionamento: "Na rua",
      transporte_publico: "Linhas do centro"
    }
  },
  {
    id: 10,
    titulo: "Jazz Night - Casa de Shows Melodia",
    data: "2025-06-29",
    dataFim: null,
    local: "Casa de Shows Melodia",
    categoria: "Musical",
    tipo: "privado",
    descricao: "Noite especial de jazz com artistas locais e nacionais.",
    imagem: "/images/eventos/jazz-night.jpg",
    destaque: false,
    preco: "R$ 35,00",
    organizador: "Casa de Shows Melodia",
    status: "programado",
    horario: "20:00",
    programacao: [
      {
        horario: "20:00",
        atividade: "Quarteto Jazz Local",
        local: "Casa de Shows Melodia"
      },
      {
        horario: "22:00",
        atividade: "Banda Nacional de Jazz",
        local: "Casa de Shows Melodia"
      }
    ],
    locais: [
      {
        nome: "Casa de Shows Melodia",
        endereco: "Av. Principal, 456, Heliópolis",
        tipo: "casa_shows"
      }
    ],
    informacoes: {
      duracao: "1 noite",
      publico_esperado: "300 pessoas",
      restricoes: "Classificação 16 anos",
      acessibilidade: "Totalmente acessível",
      estacionamento: "Estacionamento próprio",
      transporte_publico: "Linha Heliópolis"
    }
  },
  {
    id: 11,
    titulo: "Feira de Negócios do Agreste",
    data: "2025-06-28",
    dataFim: "2025-06-29",
    local: "Centro de Convenções",
    categoria: "Negócios",
    tipo: "privado",
    descricao: "Feira de negócios e networking para empresários da região.",
    imagem: "/images/eventos/feira-negocios.jpg",
    destaque: false,
    preco: "R$ 50,00",
    organizador: "Associação Comercial",
    status: "programado",
    horario: "08:00",
    programacao: [
      {
        horario: "08:00",
        atividade: "Credenciamento",
        local: "Centro de Convenções"
      },
      {
        horario: "09:00",
        atividade: "Palestra: Inovação no Agronegócio",
        local: "Auditório Principal"
      },
      {
        horario: "14:00",
        atividade: "Mesa Redonda: Economia Regional",
        local: "Sala de Conferências"
      }
    ],
    locais: [
      {
        nome: "Centro de Convenções",
        endereco: "Av. dos Empresários, 789, Boa Vista",
        tipo: "centro_convenções"
      }
    ],
    informacoes: {
      duracao: "2 dias",
      publico_esperado: "500 pessoas",
      restricoes: "Evento profissional",
      acessibilidade: "Totalmente acessível",
      estacionamento: "Estacionamento gratuito",
      transporte_publico: "Linha Boa Vista"
    }
  },
  {
    id: 12,
    titulo: "Sarau Cultural - Café das Artes",
    data: "2025-06-29",
    dataFim: null,
    local: "Café das Artes",
    categoria: "Cultural",
    tipo: "privado",
    descricao: "Sarau com poesia, música e arte local em ambiente aconchegante.",
    imagem: "/images/eventos/sarau-cultural.jpg",
    destaque: false,
    preco: "R$ 20,00",
    organizador: "Café das Artes",
    status: "programado",
    horario: "19:00",
    programacao: [
      {
        horario: "19:00",
        atividade: "Abertura com violão",
        local: "Café das Artes"
      },
      {
        horario: "20:00",
        atividade: "Recital de Poesia",
        local: "Café das Artes"
      },
      {
        horario: "21:00",
        atividade: "Música ao vivo",
        local: "Café das Artes"
      }
    ],
    locais: [
      {
        nome: "Café das Artes",
        endereco: "Rua dos Artistas, 321, Centro",
        tipo: "café_cultural"
      }
    ],
    informacoes: {
      duracao: "1 noite",
      publico_esperado: "80 pessoas",
      restricoes: "Ambiente familiar",
      acessibilidade: "Acesso por escada",
      estacionamento: "Na rua",
      transporte_publico: "Todas as linhas do centro"
    }
  },
  {
    id: 13,
    titulo: "Feira de Artesanato da Praça",
    data: "2025-06-28",
    dataFim: "2025-06-29",
    local: "Praça da Bandeira",
    categoria: "Cultural",
    tipo: "publico",
    descricao: "Feira com artesanato local, produtos regionais e apresentações culturais.",
    imagem: "/images/eventos/feira-artesanato.jpg",
    destaque: false,
    preco: "Gratuito",
    organizador: "Secretaria de Cultura",
    status: "programado",
    horario: "08:00",
    programacao: [
      {
        horario: "08:00",
        atividade: "Abertura da Feira",
        local: "Praça da Bandeira"
      },
      {
        horario: "10:00",
        atividade: "Oficina de Cerâmica",
        local: "Estande Cultural"
      },
      {
        horario: "14:00",
        atividade: "Apresentação de Violeiros",
        local: "Palco da Praça"
      },
      {
        horario: "16:00",
        atividade: "Roda de Capoeira",
        local: "Área Central"
      }
    ],
    locais: [
      {
        nome: "Praça da Bandeira",
        endereco: "Centro, Garanhuns - PE",
        tipo: "feira_livre"
      }
    ],
    informacoes: {
      duracao: "2 dias",
      publico_esperado: "2.000 pessoas",
      restricoes: "Evento familiar",
      acessibilidade: "Totalmente acessível",
      estacionamento: "Disponível nas ruas próximas",
      transporte_publico: "Todas as linhas do centro"
    }
  },
  {
    id: 14,
    titulo: "Noite Sertaneja - Clube dos Oficiais",
    data: "2025-06-28",
    dataFim: null,
    local: "Clube dos Oficiais",
    categoria: "Musical",
    tipo: "privado",
    descricao: "Noite sertaneja com duplas locais e nacionais, open bar incluído.",
    imagem: "/images/eventos/noite-sertaneja.jpg",
    destaque: false,
    preco: "R$ 80,00",
    organizador: "Clube dos Oficiais",
    status: "programado",
    horario: "20:00",
    programacao: [
      {
        horario: "20:00",
        atividade: "Abertura com DJ",
        local: "Salão Principal"
      },
      {
        horario: "21:00",
        atividade: "Dupla Local: João & Pedro",
        local: "Palco Principal"
      },
      {
        horario: "23:00",
        atividade: "Show Principal: Zé Neto & Cristiano",
        local: "Palco Principal"
      }
    ],
    locais: [
      {
        nome: "Clube dos Oficiais",
        endereco: "Av. Ruber van der Linden, 678, Heliópolis",
        tipo: "clube_social"
      }
    ],
    informacoes: {
      duracao: "1 noite",
      publico_esperado: "800 pessoas",
      restricoes: "Proibido para menores de 18 anos",
      acessibilidade: "Totalmente acessível",
      estacionamento: "Estacionamento próprio gratuito",
      transporte_publico: "Linha Heliópolis"
    }
  },
  {
    id: 15,
    titulo: "Cinema ao Ar Livre - Parque JK",
    data: "2025-06-28",
    dataFim: null,
    local: "Parque Juscelino Kubitschek",
    categoria: "Cultural",
    tipo: "publico",
    descricao: "Sessão de cinema ao ar livre com filmes nacionais e pipoca grátis.",
    imagem: "/images/eventos/cinema-ar-livre.jpg",
    destaque: false,
    preco: "Gratuito",
    organizador: "Prefeitura de Garanhuns",
    status: "programado",
    horario: "19:00",
    programacao: [
      {
        horario: "19:00",
        atividade: "Abertura e distribuição de pipoca",
        local: "Parque JK"
      },
      {
        horario: "19:30",
        atividade: "Filme: 'Cidade de Deus'",
        local: "Telão do Parque"
      }
    ],
    locais: [
      {
        nome: "Parque Juscelino Kubitschek",
        endereco: "Av. Juscelino Kubitschek, Santo Antônio",
        tipo: "parque_publico"
      }
    ],
    informacoes: {
      duracao: "1 noite",
      publico_esperado: "500 pessoas",
      restricoes: "Levar cadeira ou canga",
      acessibilidade: "Totalmente acessível",
      estacionamento: "Estacionamento gratuito",
      transporte_publico: "Linha Santo Antônio"
    }
  },
  {
    id: 16,
    titulo: "Roda de Samba - Bar da Esquina",
    data: "2025-06-29",
    dataFim: null,
    local: "Bar da Esquina",
    categoria: "Musical",
    tipo: "privado",
    descricao: "Roda de samba tradicional com músicos locais e muita descontração.",
    imagem: "/images/eventos/roda-samba.jpg",
    destaque: false,
    preco: "R$ 25,00",
    organizador: "Bar da Esquina",
    status: "programado",
    horario: "15:00",
    programacao: [
      {
        horario: "15:00",
        atividade: "Início da Roda de Samba",
        local: "Bar da Esquina"
      },
      {
        horario: "16:30",
        atividade: "Participação Especial: Grupo Pagode do Bem",
        local: "Bar da Esquina"
      },
      {
        horario: "18:00",
        atividade: "Roda Aberta - Participação do Público",
        local: "Bar da Esquina"
      }
    ],
    locais: [
      {
        nome: "Bar da Esquina",
        endereco: "Rua Dr. José Mariano, 234, Centro",
        tipo: "bar"
      }
    ],
    informacoes: {
      duracao: "1 tarde",
      publico_esperado: "120 pessoas",
      restricoes: "Proibido para menores de 18 anos",
      acessibilidade: "Acesso limitado",
      estacionamento: "Na rua",
      transporte_publico: "Todas as linhas do centro"
    }
  },
  {
    id: 17,
    titulo: "Torneio de Xadrez Municipal",
    data: "2025-06-29",
    dataFim: null,
    local: "Biblioteca Municipal",
    categoria: "Esportivo",
    tipo: "publico",
    descricao: "Torneio municipal de xadrez aberto para todas as idades.",
    imagem: "/images/eventos/torneio-xadrez.jpg",
    destaque: false,
    preco: "R$ 10,00",
    organizador: "Secretaria de Esportes",
    status: "programado",
    horario: "08:00",
    programacao: [
      {
        horario: "08:00",
        atividade: "Inscrições e Credenciamento",
        local: "Biblioteca Municipal"
      },
      {
        horario: "09:00",
        atividade: "1ª Rodada",
        local: "Salão Principal"
      },
      {
        horario: "14:00",
        atividade: "Rodadas Finais",
        local: "Salão Principal"
      },
      {
        horario: "17:00",
        atividade: "Premiação",
        local: "Salão Principal"
      }
    ],
    locais: [
      {
        nome: "Biblioteca Municipal",
        endereco: "Rua Aprígio Guimarães, 456, Centro",
        tipo: "biblioteca"
      }
    ],
    informacoes: {
      duracao: "1 dia",
      publico_esperado: "150 pessoas",
      restricoes: "Inscrição obrigatória",
      acessibilidade: "Totalmente acessível",
      estacionamento: "Limitado no centro",
      transporte_publico: "Todas as linhas do centro"
    }
  },
  {
    id: 18,
    titulo: "Festival Gastronômico - Food Trucks",
    data: "2025-06-28",
    dataFim: "2025-06-29",
    local: "Parque Euclides Dourado",
    categoria: "Gastronômico",
    tipo: "publico",
    descricao: "Festival com food trucks, pratos regionais e música ambiente.",
    imagem: "/images/eventos/festival-gastronomico.jpg",
    destaque: true,
    preco: "Gratuito (consumação à parte)",
    organizador: "Associação de Food Trucks",
    status: "programado",
    horario: "17:00",
    programacao: [
      {
        horario: "17:00",
        atividade: "Abertura do Festival",
        local: "Parque Euclides Dourado"
      },
      {
        horario: "18:00",
        atividade: "Degustação Gratuita",
        local: "Área dos Food Trucks"
      },
      {
        horario: "19:30",
        atividade: "Música ao Vivo",
        local: "Palco do Parque"
      },
      {
        horario: "21:00",
        atividade: "Concurso do Melhor Prato",
        local: "Área Central"
      }
    ],
    locais: [
      {
        nome: "Parque Euclides Dourado",
        endereco: "Av. Euclides Dourado, Garanhuns - PE",
        tipo: "parque_publico"
      }
    ],
    informacoes: {
      duracao: "2 dias",
      publico_esperado: "3.000 pessoas",
      restricoes: "Evento familiar",
      acessibilidade: "Totalmente acessível",
      estacionamento: "Estacionamento gratuito",
      transporte_publico: "Linhas especiais"
    }
  }
];

export const categorias = [
  'todos',
  'Musical',
  'Religioso',
  'Forró', 
  'Gospel',
  'Natalino',
  'Cultural',
  'Negócios',
  'Esportivo',
  'Gastronômico'
];

export const formatarData = (data, dataFim = null) => {
  const opcoes = { day: '2-digit', month: 'long', year: 'numeric' };
  const dataFormatada = new Date(data).toLocaleDateString('pt-BR', opcoes);
  
  if (dataFim) {
    const dataFimFormatada = new Date(dataFim).toLocaleDateString('pt-BR', opcoes);
    return `${dataFormatada} a ${dataFimFormatada}`;
  }
  
  return dataFormatada;
};

export const formatarDataCurta = (data) => {
  const opcoes = { day: '2-digit', month: '2-digit' };
  return new Date(data).toLocaleDateString('pt-BR', opcoes);
};

export const getProximoEvento = (eventos) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Normalizar para início do dia
  
  // Primeiro, verificar se há algum evento em andamento (hoje está dentro do período do evento)
  const eventoEmAndamento = eventos.find(evento => {
    const dataInicio = new Date(evento.data);
    dataInicio.setHours(0, 0, 0, 0);
    
    const dataFim = evento.dataFim ? new Date(evento.dataFim) : dataInicio;
    dataFim.setHours(23, 59, 59, 999); // Final do dia
    
    return hoje >= dataInicio && hoje <= dataFim;
  });
  
  if (eventoEmAndamento) {
    return { ...eventoEmAndamento, status: 'em_andamento' };
  }
  
  // Se não há evento em andamento, buscar o próximo evento futuro
  const eventosOrdenados = eventos
    .filter(evento => {
      const dataInicio = new Date(evento.data);
      dataInicio.setHours(0, 0, 0, 0);
      return dataInicio > hoje; // Apenas eventos futuros
    })
    .sort((a, b) => new Date(a.data) - new Date(b.data));
  
  return eventosOrdenados.length > 0 ? eventosOrdenados[0] : eventos[0]; // Fallback para o primeiro evento se nenhum futuro
};

export const getStatusEvento = (evento) => {
  const hoje = new Date();
  const dataInicio = new Date(evento.data);
  const dataFim = evento.dataFim ? new Date(evento.dataFim) : dataInicio;
  
  if (evento.status === 'em_andamento' || (hoje >= dataInicio && hoje <= dataFim)) {
    return 'em_andamento';
  } else if (hoje > dataFim) {
    return 'finalizado';
  } else {
    return 'programado';
  }
};

export const getEventosDaSemana = (eventos) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Normalizar para início do dia
  const diaSemana = hoje.getDay(); // 0 = domingo, 6 = sábado
  
  // Calcular próximo domingo
  let proximoDomingo;
  
  if (diaSemana === 0) { // Se hoje é domingo
    proximoDomingo = new Date(hoje);
  } else { // Qualquer outro dia da semana
    proximoDomingo = new Date(hoje);
    proximoDomingo.setDate(hoje.getDate() + (7 - diaSemana));
  }
  
  proximoDomingo.setHours(23, 59, 59, 999); // Final do domingo
  
  // Filtrar eventos da semana (de hoje até domingo)
  return eventos.filter(evento => {
    const dataEvento = new Date(evento.data);
    dataEvento.setHours(0, 0, 0, 0);
    const dataFimEvento = evento.dataFim ? new Date(evento.dataFim) : dataEvento;
    dataFimEvento.setHours(23, 59, 59, 999);
    
    // Verificar se o evento acontece entre hoje e domingo
    return (
      (dataEvento >= hoje && dataEvento <= proximoDomingo) ||
      (evento.dataFim && dataFimEvento >= hoje && dataEvento <= proximoDomingo)
    );
  }).sort((a, b) => new Date(a.data) - new Date(b.data));
};

export const getEventosFimDeSemana = (eventos) => {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = domingo, 6 = sábado
  
  // Calcular próximo fim de semana
  let proximoSabado, proximoDomingo;
  
  if (diaSemana === 6) { // Se hoje é sábado
    proximoSabado = new Date(hoje);
    proximoDomingo = new Date(hoje);
    proximoDomingo.setDate(hoje.getDate() + 1);
  } else if (diaSemana === 0) { // Se hoje é domingo
    proximoSabado = new Date(hoje);
    proximoSabado.setDate(hoje.getDate() - 1);
    proximoDomingo = new Date(hoje);
  } else { // Dias da semana
    proximoSabado = new Date(hoje);
    proximoSabado.setDate(hoje.getDate() + (6 - diaSemana));
    proximoDomingo = new Date(proximoSabado);
    proximoDomingo.setDate(proximoSabado.getDate() + 1);
  }
  
  // Filtrar eventos do fim de semana
  return eventos.filter(evento => {
    const dataEvento = new Date(evento.data);
    const dataFimEvento = evento.dataFim ? new Date(evento.dataFim) : dataEvento;
    
    // Verificar se o evento acontece no fim de semana atual/próximo
    return (
      (dataEvento.toDateString() === proximoSabado.toDateString()) ||
      (dataEvento.toDateString() === proximoDomingo.toDateString()) ||
      (evento.dataFim && dataFimEvento >= proximoSabado && dataEvento <= proximoDomingo)
    );
  }).sort((a, b) => new Date(a.data) - new Date(b.data));
}; 