import { Idea, NewEvolutionInput, NewIdeaInput } from "@/lib/types";
import { calculateIdeaScore } from "@/lib/ideaMetrics";

const STORAGE_KEY = "jardim-de-ideias";
const STORAGE_VERSION_KEY = "jardim-de-ideias-versao-seed";
const CURRENT_SEED_VERSION = "ideias-simuladas-v2";

const seededIdeas: Idea[] = [
  {
    id: "idea-mercado-local",
    title: "Mapa de produtores locais",
    description:
      "Uma plataforma para encontrar pequenos produtores por bairro, safra e disponibilidade.",
    problem:
      "Comprar direto de produtores ainda depende de grupos dispersos e recomendações difíceis de acompanhar.",
    supports: 8,
    score: 0,
    createdAt: "2026-04-24T10:00:00.000Z",
    evolutions: [
      {
        id: "evolution-mercado-1",
        type: "aplicacao",
        impact: "medio",
        content:
          "Começar com uma cidade piloto e permitir retirada em pontos locais já conhecidos.",
        createdAt: "2026-04-24T12:30:00.000Z",
      },
      {
        id: "evolution-mercado-2",
        type: "melhoria",
        impact: "alto",
        content:
          "Adicionar filtros por produto disponível na semana e distância do comprador.",
        createdAt: "2026-04-25T09:15:00.000Z",
      },
      {
        id: "evolution-mercado-3",
        type: "critica",
        impact: "medio",
        content:
          "Evitar que a plataforma vire apenas vitrine: produtores precisam conseguir atualizar disponibilidade sem trabalho extra.",
        createdAt: "2026-04-25T13:20:00.000Z",
      },
    ],
  },
  {
    id: "idea-oficinas-bairro",
    title: "Oficinas rápidas entre vizinhos",
    description:
      "Um mural para pessoas oferecerem encontros curtos sobre habilidades práticas.",
    problem:
      "Conhecimentos úteis ficam invisíveis dentro do próprio bairro e não viram troca real.",
    supports: 5,
    score: 0,
    createdAt: "2026-04-18T15:40:00.000Z",
    evolutions: [
      {
        id: "evolution-oficinas-1",
        type: "variacao",
        impact: "baixo",
        content:
          "Criar trilhas temáticas, como conserto doméstico, culinária e organização financeira.",
        createdAt: "2026-04-19T18:05:00.000Z",
      },
      {
        id: "evolution-oficinas-2",
        type: "aplicacao",
        impact: "medio",
        content:
          "Testar primeiro com encontros de 40 minutos em espaços já existentes, como escolas e associações.",
        createdAt: "2026-04-22T10:10:00.000Z",
      },
    ],
  },
  {
    id: "idea-biblioteca-ferramentas",
    title: "Biblioteca de ferramentas compartilhadas",
    description:
      "Um acervo de bairro para emprestar furadeiras, escadas, kits de reparo e equipamentos usados poucas vezes.",
    problem:
      "Muitas pessoas compram ferramentas caras para um uso pontual, enquanto outras têm itens parados em casa.",
    supports: 14,
    score: 0,
    createdAt: "2026-04-23T11:20:00.000Z",
    evolutions: [
      {
        id: "evolution-ferramentas-1",
        type: "melhoria",
        impact: "alto",
        content:
          "Criar um sistema simples de caução por item para reduzir perdas sem burocratizar o empréstimo.",
        createdAt: "2026-04-24T08:30:00.000Z",
      },
      {
        id: "evolution-ferramentas-2",
        type: "aplicacao",
        impact: "medio",
        content:
          "Começar com um condomínio ou rua piloto antes de abrir para um bairro inteiro.",
        createdAt: "2026-04-24T15:00:00.000Z",
      },
      {
        id: "evolution-ferramentas-3",
        type: "critica",
        impact: "medio",
        content:
          "O ponto crítico é manutenção: alguém precisa verificar estado dos itens na devolução.",
        createdAt: "2026-04-25T08:10:00.000Z",
      },
    ],
  },
  {
    id: "idea-alerta-ilhas-calor",
    title: "Mapa cidadão de ilhas de calor",
    description:
      "Uma coleta simples de relatos e medições para identificar ruas muito quentes e priorizar sombra, árvores e água.",
    problem:
      "O desconforto térmico é sentido no cotidiano, mas raramente vira dado acionável para intervenções urbanas.",
    supports: 11,
    score: 0,
    createdAt: "2026-04-21T09:00:00.000Z",
    evolutions: [
      {
        id: "evolution-calor-1",
        type: "aplicacao",
        impact: "alto",
        content:
          "Cruzar relatos com horários de maior circulação de pedestres, como entrada de escolas e pontos de ônibus.",
        createdAt: "2026-04-22T12:00:00.000Z",
      },
      {
        id: "evolution-calor-2",
        type: "melhoria",
        impact: "medio",
        content:
          "Usar uma escala simples de sensação térmica para não depender só de sensores.",
        createdAt: "2026-04-23T16:40:00.000Z",
      },
      {
        id: "evolution-calor-3",
        type: "variacao",
        impact: "baixo",
        content:
          "Criar uma versão escolar, em que turmas mapeiam trajetos quentes no caminho para a escola.",
        createdAt: "2026-04-24T11:30:00.000Z",
      },
      {
        id: "evolution-calor-4",
        type: "critica",
        impact: "medio",
        content:
          "Sem parceria com prefeitura ou grupos locais independentes, o mapa pode gerar frustração por não virar ação.",
        createdAt: "2026-04-25T10:05:00.000Z",
      },
    ],
  },
  {
    id: "idea-cardapio-sobra-zero",
    title: "Cardápio sobra zero para restaurantes pequenos",
    description:
      "Uma rotina simples para transformar ingredientes próximos do vencimento em pratos do dia com desconto.",
    problem:
      "Pequenos restaurantes perdem margem e jogam comida fora por falta de previsibilidade no consumo diário.",
    supports: 9,
    score: 0,
    createdAt: "2026-04-20T14:10:00.000Z",
    evolutions: [
      {
        id: "evolution-sobra-1",
        type: "melhoria",
        impact: "medio",
        content:
          "Adicionar etiquetas internas com prioridade de uso para a equipe decidir o cardápio sem planilha complexa.",
        createdAt: "2026-04-21T09:25:00.000Z",
      },
      {
        id: "evolution-sobra-2",
        type: "aplicacao",
        impact: "alto",
        content:
          "Integrar com grupos locais de almoço para divulgar rapidamente os pratos com desconto.",
        createdAt: "2026-04-22T13:15:00.000Z",
      },
    ],
  },
  {
    id: "idea-trilhas-requalificacao",
    title: "Trilhas curtas de requalificação profissional",
    description:
      "Sequências de desafios práticos de duas semanas para pessoas testarem novas áreas antes de investir em cursos longos.",
    problem:
      "Mudar de carreira costuma exigir tempo e dinheiro antes mesmo da pessoa descobrir se combina com a área.",
    supports: 17,
    score: 0,
    createdAt: "2026-04-19T08:50:00.000Z",
    evolutions: [
      {
        id: "evolution-trilhas-1",
        type: "aplicacao",
        impact: "alto",
        content:
          "Começar com trilhas de suporte ao cliente, análise de dados básica e automação de tarefas.",
        createdAt: "2026-04-20T10:20:00.000Z",
      },
      {
        id: "evolution-trilhas-2",
        type: "melhoria",
        impact: "medio",
        content:
          "Cada trilha deveria terminar com um artefato de portfólio, não apenas certificado.",
        createdAt: "2026-04-21T17:45:00.000Z",
      },
      {
        id: "evolution-trilhas-3",
        type: "critica",
        impact: "medio",
        content:
          "É importante deixar claro que a trilha é exploração, não promessa de emprego.",
        createdAt: "2026-04-23T12:05:00.000Z",
      },
      {
        id: "evolution-trilhas-4",
        type: "variacao",
        impact: "baixo",
        content:
          "Uma versão para empresas poderia mapear talentos internos interessados em migração de área.",
        createdAt: "2026-04-24T09:40:00.000Z",
      },
      {
        id: "evolution-trilhas-5",
        type: "melhoria",
        impact: "alto",
        content:
          "Adicionar mentores voluntários por trilha para revisar entregas pequenas ao final de cada semana.",
        createdAt: "2026-04-25T14:00:00.000Z",
      },
    ],
  },
  {
    id: "idea-rota-acessivel",
    title: "Rotas acessíveis para deslocamentos cotidianos",
    description:
      "Um mapa colaborativo que indica calçadas transitáveis, rampas, obstáculos e trechos difíceis para cadeirantes e idosos.",
    problem:
      "Aplicativos de rota mostram distância, mas não informam se o caminho é realmente possível para quem tem mobilidade reduzida.",
    supports: 13,
    score: 0,
    createdAt: "2026-04-22T07:30:00.000Z",
    evolutions: [
      {
        id: "evolution-acessivel-1",
        type: "aplicacao",
        impact: "alto",
        content:
          "Priorizar rotas para postos de saúde, farmácias, mercados e terminais de ônibus.",
        createdAt: "2026-04-22T14:30:00.000Z",
      },
      {
        id: "evolution-acessivel-2",
        type: "critica",
        impact: "medio",
        content:
          "Relatos precisam ter data, porque obras e buracos mudam rapidamente.",
        createdAt: "2026-04-23T09:00:00.000Z",
      },
      {
        id: "evolution-acessivel-3",
        type: "melhoria",
        impact: "alto",
        content:
          "Permitir registrar fotos de obstáculos e sugerir rota alternativa no mesmo fluxo.",
        createdAt: "2026-04-24T18:10:00.000Z",
      },
    ],
  },
  {
    id: "idea-agenda-cuidados",
    title: "Agenda compartilhada de cuidados familiares",
    description:
      "Um quadro simples para organizar remédios, consultas, compras e visitas quando várias pessoas cuidam de alguém.",
    problem:
      "Famílias distribuem cuidados por mensagens soltas, o que gera esquecimento, retrabalho e sobrecarga invisível.",
    supports: 7,
    score: 0,
    createdAt: "2026-04-23T18:00:00.000Z",
    evolutions: [
      {
        id: "evolution-cuidados-1",
        type: "melhoria",
        impact: "alto",
        content:
          "Separar tarefas críticas, como remédio, de tarefas flexíveis, como compras e visitas.",
        createdAt: "2026-04-24T08:00:00.000Z",
      },
      {
        id: "evolution-cuidados-2",
        type: "critica",
        impact: "medio",
        content:
          "Sem login nesta versão, a ideia pode ser prototipada como quadro local imprimível ou compartilhável por exportação.",
        createdAt: "2026-04-25T09:35:00.000Z",
      },
    ],
  },
  {
    id: "idea-diario-aprendizado",
    title: "Diário de aprendizado com provas pequenas",
    description:
      "Um espaço para registrar o que foi aprendido e anexar pequenas evidências práticas, como prints, textos ou mini projetos.",
    problem:
      "Pessoas estudam muito, mas têm dificuldade de transformar aprendizado disperso em progresso visível.",
    supports: 6,
    score: 0,
    createdAt: "2026-04-17T19:20:00.000Z",
    evolutions: [
      {
        id: "evolution-diario-1",
        type: "melhoria",
        impact: "medio",
        content:
          "Usar perguntas fixas: o que aprendi, onde travei, que prova pequena produzi.",
        createdAt: "2026-04-18T10:00:00.000Z",
      },
    ],
  },
  {
    id: "idea-cozinha-bairro",
    title: "Cozinha colaborativa por demanda do bairro",
    description:
      "Uma organização semanal de refeições compartilhadas baseada em demanda real, doações e capacidade de voluntários.",
    problem:
      "Iniciativas de alimentação solidária sofrem com imprevisibilidade de insumos, voluntários e quantidade de refeições necessárias.",
    supports: 15,
    score: 0,
    createdAt: "2026-04-16T12:00:00.000Z",
    evolutions: [
      {
        id: "evolution-cozinha-1",
        type: "aplicacao",
        impact: "alto",
        content:
          "Mapear demanda por semana, não por dia, para facilitar compra e escala de voluntários.",
        createdAt: "2026-04-17T13:30:00.000Z",
      },
      {
        id: "evolution-cozinha-2",
        type: "melhoria",
        impact: "medio",
        content:
          "Criar um quadro público de necessidades: arroz, proteína, embalagens, transporte e turnos.",
        createdAt: "2026-04-18T16:45:00.000Z",
      },
      {
        id: "evolution-cozinha-3",
        type: "critica",
        impact: "medio",
        content:
          "Precisa haver responsável sanitário ou orientação mínima para evitar risco alimentar.",
        createdAt: "2026-04-20T09:10:00.000Z",
      },
      {
        id: "evolution-cozinha-4",
        type: "variacao",
        impact: "baixo",
        content:
          "Uma versão universitária poderia reaproveitar alimentos próximos do vencimento dos restaurantes do campus.",
        createdAt: "2026-04-22T11:40:00.000Z",
      },
      {
        id: "evolution-cozinha-5",
        type: "melhoria",
        impact: "alto",
        content:
          "Adicionar previsões por evento local, como chuvas fortes, feriados e fechamento de escolas.",
        createdAt: "2026-04-24T14:25:00.000Z",
      },
      {
        id: "evolution-cozinha-6",
        type: "aplicacao",
        impact: "medio",
        content:
          "Testar primeiro com 50 refeições e formulário físico simples para quem não usa celular.",
        createdAt: "2026-04-25T08:50:00.000Z",
      },
    ],
  },
  {
    id: "idea-guia-servicos-publicos",
    title: "Guia simples de serviços públicos por situação",
    description:
      "Um guia que organiza serviços públicos a partir da situação da pessoa, e não pelo nome do órgão.",
    problem:
      "Quem precisa de ajuda geralmente não sabe qual secretaria, formulário ou documento procurar.",
    supports: 10,
    score: 0,
    createdAt: "2026-04-15T10:25:00.000Z",
    evolutions: [
      {
        id: "evolution-servicos-1",
        type: "melhoria",
        impact: "alto",
        content:
          "Organizar por jornadas: perdi documentos, preciso de remédio, estou sem renda, sofri violência.",
        createdAt: "2026-04-16T15:00:00.000Z",
      },
      {
        id: "evolution-servicos-2",
        type: "critica",
        impact: "medio",
        content:
          "O maior desafio é manter informação atualizada, especialmente endereços e horários.",
        createdAt: "2026-04-18T09:30:00.000Z",
      },
      {
        id: "evolution-servicos-3",
        type: "aplicacao",
        impact: "medio",
        content:
          "Começar com uma cidade e cinco situações mais frequentes em CRAS e unidades de saúde.",
        createdAt: "2026-04-20T17:20:00.000Z",
      },
    ],
  },
  {
    id: "idea-compostagem-condominios",
    title: "Compostagem prática para condomínios pequenos",
    description:
      "Um modelo de operação para separar resíduos orgânicos, produzir composto e distribuir manutenção entre moradores.",
    problem:
      "Condomínios querem reduzir lixo, mas desistem quando a solução exige coordenação demais.",
    supports: 4,
    score: 0,
    createdAt: "2026-04-24T20:00:00.000Z",
    evolutions: [
      {
        id: "evolution-compostagem-1",
        type: "aplicacao",
        impact: "medio",
        content:
          "Começar com baldes identificados por andar e uma escala simples de manutenção semanal.",
        createdAt: "2026-04-25T07:20:00.000Z",
      },
    ],
  },
  {
    id: "idea-sinalizacao-enchentes",
    title: "Sinalização local de risco de enchente",
    description:
      "Um sistema simples de marcações físicas e avisos locais para indicar pontos de alagamento recorrente.",
    problem:
      "Moradores conhecem áreas de risco, mas visitantes, entregadores e novos moradores não têm essa memória local.",
    supports: 12,
    score: 0,
    createdAt: "2026-04-22T21:15:00.000Z",
    evolutions: [
      {
        id: "evolution-enchentes-1",
        type: "melhoria",
        impact: "alto",
        content:
          "Criar níveis visuais simples: atenção, evite passagem, rota alternativa.",
        createdAt: "2026-04-23T08:20:00.000Z",
      },
      {
        id: "evolution-enchentes-2",
        type: "aplicacao",
        impact: "medio",
        content:
          "Usar comércios locais como pontos de atualização durante período de chuva.",
        createdAt: "2026-04-24T12:35:00.000Z",
      },
      {
        id: "evolution-enchentes-3",
        type: "critica",
        impact: "medio",
        content:
          "A sinalização não pode substituir alerta oficial, precisa ser apresentada como apoio local entre moradores.",
        createdAt: "2026-04-25T11:55:00.000Z",
      },
    ],
  },
];

const initialIdeas = seededIdeas.map(recalculateIdeaScore);

export function loadIdeas(): Idea[] {
  if (typeof window === "undefined") return initialIdeas;

  const storedVersion = window.localStorage.getItem(STORAGE_VERSION_KEY);
  const storedIdeas = window.localStorage.getItem(STORAGE_KEY);
  if (!storedIdeas || storedVersion !== CURRENT_SEED_VERSION) {
    saveIdeas(initialIdeas);
    window.localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
    return initialIdeas;
  }

  try {
    const parsedIdeas = JSON.parse(storedIdeas) as Idea[];
    return parsedIdeas.map(recalculateIdeaScore);
  } catch {
    saveIdeas(initialIdeas);
    return initialIdeas;
  }
}

export function saveIdeas(ideas: Idea[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  window.localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
}

export function createIdea(input: NewIdeaInput): Idea {
  return recalculateIdeaScore({
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    problem: input.problem.trim(),
    supports: 0,
    score: 0,
    createdAt: new Date().toISOString(),
    evolutions: [],
  });
}

export function createEvolution(input: NewEvolutionInput) {
  return {
    id: crypto.randomUUID(),
    type: input.type,
    content: input.content.trim(),
    impact: input.impact,
    createdAt: new Date().toISOString(),
  };
}

export function recalculateIdeaScore(idea: Idea): Idea {
  return {
    ...idea,
    score: calculateIdeaScore(idea),
  };
}
