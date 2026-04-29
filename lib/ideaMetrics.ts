import { Evolution, Idea, IdeaStatus } from "@/lib/types";

const RECENT_BONUS_HOURS = 48;

export function calculateIdeaScore(idea: Pick<Idea, "supports" | "evolutions" | "createdAt">) {
  return idea.supports + idea.evolutions.length * 2 + getRecentBonus(idea.createdAt);
}

export function getIdeaStatus(idea: Pick<Idea, "evolutions">): IdeaStatus {
  const evolutionCount = idea.evolutions.length;

  if (evolutionCount >= 6) return "Madura";
  if (evolutionCount >= 2) return "Em evolução";
  return "Nova";
}

export function getLatestEvolution(evolutions: Evolution[]) {
  return [...evolutions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
}

export function sortEvolutionsByNewest(evolutions: Evolution[]) {
  return [...evolutions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function getRecentBonus(createdAt: string) {
  const createdAtTime = new Date(createdAt).getTime();
  const recentWindow = RECENT_BONUS_HOURS * 60 * 60 * 1000;

  return Date.now() - createdAtTime <= recentWindow ? 2 : 0;
}
