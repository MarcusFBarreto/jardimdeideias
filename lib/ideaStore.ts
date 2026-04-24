import { Idea, NewEvolutionInput, NewIdeaInput } from "@/lib/types";

const STORAGE_KEY = "jardim-de-ideias";

const initialIdeas: Idea[] = [
  {
    id: "idea-mercado-local",
    title: "Mapa de produtores locais",
    description:
      "Uma plataforma para encontrar pequenos produtores por bairro, safra e disponibilidade.",
    problem:
      "Comprar direto de produtores ainda depende de grupos dispersos e recomendações difíceis de acompanhar.",
    supports: 8,
    score: 10,
    createdAt: "2026-04-20T10:00:00.000Z",
    evolutions: [
      {
        id: "evolution-mercado-1",
        type: "aplicacao",
        content:
          "Começar com uma cidade piloto e permitir retirada em pontos comunitários.",
        createdAt: "2026-04-21T12:30:00.000Z",
      },
      {
        id: "evolution-mercado-2",
        type: "melhoria",
        content:
          "Adicionar filtros por produto disponível na semana e distância do comprador.",
        createdAt: "2026-04-22T09:15:00.000Z",
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
    score: 6,
    createdAt: "2026-04-18T15:40:00.000Z",
    evolutions: [
      {
        id: "evolution-oficinas-1",
        type: "variacao",
        content:
          "Criar trilhas temáticas, como conserto doméstico, culinária e organização financeira.",
        createdAt: "2026-04-19T18:05:00.000Z",
      },
    ],
  },
];

export function loadIdeas(): Idea[] {
  if (typeof window === "undefined") return initialIdeas;

  const storedIdeas = window.localStorage.getItem(STORAGE_KEY);
  if (!storedIdeas) {
    saveIdeas(initialIdeas);
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
    createdAt: new Date().toISOString(),
  };
}

export function recalculateIdeaScore(idea: Idea): Idea {
  return {
    ...idea,
    score: idea.supports + idea.evolutions.length,
  };
}
