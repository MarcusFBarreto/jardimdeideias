import { InspirationTopic, NewIdeaInput } from "@/lib/types";

const TOPICS_STORAGE_KEY = "jardim-de-ideias-topicos";
const ACTIVE_TOPIC_LIMIT = 5;

export const curatedTopics: InspirationTopic[] = [
  {
    id: "topic-aprendizado-vizinhos",
    title: "Aprendizado entre vizinhos",
    angle:
      "Conectar pessoas que querem ensinar e aprender habilidades práticas perto de casa.",
    problem:
      "Conhecimentos úteis ficam espalhados e raramente viram trocas acessíveis entre pessoas próximas.",
    active: true,
    createdAt: "2026-04-20T09:00:00.000Z",
    source: "curated",
  },
  {
    id: "topic-reuso-inteligente",
    title: "Reuso inteligente",
    angle:
      "Criar formas simples de compartilhar objetos, ferramentas e equipamentos de uso ocasional.",
    problem:
      "Muitas pessoas compram itens caros para uso pontual enquanto vizinhos já têm esses objetos parados.",
    active: true,
    createdAt: "2026-04-20T09:05:00.000Z",
    source: "curated",
  },
  {
    id: "topic-cidades-cuidadosas",
    title: "Cidades mais cuidadosas",
    angle:
      "Organizar pequenos reparos urbanos que podem ser registrados, priorizados e acompanhados.",
    problem:
      "Demandas pequenas de manutenção urbana somem no cotidiano e demoram a receber atenção.",
    active: true,
    createdAt: "2026-04-20T09:10:00.000Z",
    source: "curated",
  },
  {
    id: "topic-consumo-local",
    title: "Consumo local",
    angle:
      "Ajudar produtores independentes a mostrar o que está disponível na semana.",
    problem:
      "A oferta local muda rápido e consumidores não têm um lugar claro para descobrir produtos próximos.",
    active: true,
    createdAt: "2026-04-20T09:15:00.000Z",
    source: "curated",
  },
];

export function loadInspirationTopics(): InspirationTopic[] {
  if (typeof window === "undefined") return curatedTopics;

  const storedTopics = window.localStorage.getItem(TOPICS_STORAGE_KEY);
  if (!storedTopics) {
    saveInspirationTopics(curatedTopics);
    return curatedTopics;
  }

  try {
    return JSON.parse(storedTopics) as InspirationTopic[];
  } catch {
    saveInspirationTopics(curatedTopics);
    return curatedTopics;
  }
}

export function saveInspirationTopics(topics: InspirationTopic[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topics));
}

export function getActiveInspirationTopics(topics: InspirationTopic[]) {
  return topics
    .filter((topic) => topic.active)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, ACTIVE_TOPIC_LIMIT);
}

export function createManualTopic(input: Pick<InspirationTopic, "title" | "angle" | "problem">): InspirationTopic {
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    angle: input.angle.trim(),
    problem: input.problem.trim(),
    active: true,
    createdAt: new Date().toISOString(),
    source: "manual",
  };
}

export function topicToIdeaDraft(topic: InspirationTopic): NewIdeaInput {
  return {
    title: topic.title,
    description: topic.angle,
    problem: topic.problem,
  };
}

export function getAutomatedTopicCandidates(): InspirationTopic[] {
  // Reserved for future automation based on trends, searches, or idea activity.
  return [];
}
