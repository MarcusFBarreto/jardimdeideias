import Fuse from "fuse.js";
import {
  getIdeaCategoryLabel,
  getIdeaVariations,
  getLeadingVariation,
  getSeedTitle,
} from "@/lib/ideaModel";
import { Idea, NewIdeaInput } from "@/lib/types";

export type SimilarityLevel = "alta" | "media";

export type SimilarIdea = {
  idea: Idea;
  level: SimilarityLevel;
  score: number;
};

type SearchableIdea = Idea & {
  normalizedCategory: string;
  normalizedDescription: string;
  normalizedProblem: string;
  normalizedStatus: string;
  normalizedTitle: string;
  normalizedVariations: string;
};

type SimilarIdeaCandidate = {
  idea: SearchableIdea;
  level: SimilarityLevel;
  score: number;
};

export function normalizeIdeaText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findSimilarIdeas(
  newIdea: NewIdeaInput,
  existingIdeas: Idea[],
  limit = 5,
): SimilarIdea[] {
  const normalizedTitle = normalizeIdeaText(newIdea.title);
  const normalizedDescription = normalizeIdeaText(newIdea.description);
  const normalizedProblem = normalizeIdeaText(newIdea.problem);
  const query = [normalizedTitle, normalizedDescription, normalizedProblem]
    .filter(Boolean)
    .join(" ");

  if (query.length < 6 || existingIdeas.length === 0) return [];

  const searchableIdeas = existingIdeas.map(toSearchableIdea);
  const fuse = new Fuse(searchableIdeas, {
    includeScore: true,
    ignoreLocation: true,
    keys: [
      { name: "normalizedTitle", weight: 0.52 },
      { name: "normalizedVariations", weight: 0.26 },
      { name: "normalizedDescription", weight: 0.12 },
      { name: "normalizedProblem", weight: 0.16 },
      { name: "normalizedCategory", weight: 0.04 },
      { name: "normalizedStatus", weight: 0.02 },
    ],
    minMatchCharLength: 3,
    threshold: 0.36,
  });

  const directMatches = searchableIdeas
    .map((idea) => {
      const titleScore = getTokenOverlap(normalizedTitle, idea.normalizedTitle);
      const descriptionScore = getTokenOverlap(
        normalizedDescription,
        `${idea.normalizedDescription} ${idea.normalizedVariations} ${idea.normalizedProblem}`,
      );
      const isTitleClose =
        Boolean(normalizedTitle) &&
        (idea.normalizedTitle.includes(normalizedTitle) ||
          normalizedTitle.includes(idea.normalizedTitle) ||
          titleScore >= 0.5);
      const combinedScore = titleScore * 0.68 + descriptionScore * 0.32;

      if (!isTitleClose && combinedScore < 0.24) return null;

      return {
        idea,
        level: isTitleClose || combinedScore >= 0.42 ? "alta" : "media",
        score: 1 - combinedScore,
      } satisfies SimilarIdeaCandidate;
    })
    .filter((match): match is SimilarIdeaCandidate => match !== null);

  const fuzzyMatches = fuse
    .search(query)
    .filter((result) => (result.score ?? 1) <= 0.42)
    .map((result) => ({
      idea: result.item,
      level: (result.score ?? 1) <= 0.24 ? "alta" : "media",
      score: result.score ?? 1,
    }) satisfies SimilarIdeaCandidate);

  return [...directMatches, ...fuzzyMatches]
    .reduce<SimilarIdeaCandidate[]>((uniqueMatches, match) => {
      const existingIndex = uniqueMatches.findIndex(
        (current) => current.idea.id === match.idea.id,
      );

      if (existingIndex === -1) {
        uniqueMatches.push(match);
        return uniqueMatches;
      }

      const existing = uniqueMatches[existingIndex];
      const shouldReplace =
        getSimilarityRank(match.level) < getSimilarityRank(existing.level) ||
        (match.level === existing.level && match.score < existing.score);

      if (shouldReplace) uniqueMatches[existingIndex] = match;
      return uniqueMatches;
    }, [])
    .sort(
      (a, b) =>
        getSimilarityRank(a.level) - getSimilarityRank(b.level) ||
        a.score - b.score ||
        b.idea.score - a.idea.score,
    )
    .slice(0, limit)
    .map(({ idea, level, score }) => ({ idea, level, score }));
}

function toSearchableIdea(idea: Idea): SearchableIdea {
  const leadingVariation = getLeadingVariation(idea);

  return {
    ...idea,
    normalizedCategory: normalizeIdeaText(
      getIdeaCategoryLabel(idea, getIdeaEditorialStatus(idea)),
    ),
    normalizedDescription: normalizeIdeaText(
      `${idea.description} ${leadingVariation?.content ?? ""}`,
    ),
    normalizedProblem: normalizeIdeaText(idea.problem),
    normalizedStatus: normalizeIdeaText(getIdeaEditorialStatus(idea)),
    normalizedTitle: normalizeIdeaText(getSeedTitle(idea)),
    normalizedVariations: normalizeIdeaText(
      getIdeaVariations(idea)
        .map((variation) => `${variation.title ?? ""} ${variation.content}`)
        .join(" "),
    ),
  };
}

function getIdeaEditorialStatus(idea: Idea) {
  if (idea.evolutions.length >= 5) return "virando proposta";
  if (idea.evolutions.some((evolution) => evolution.type === "critica")) {
    return "em debate";
  }
  return "em alta";
}

function getSimilarityRank(level: SimilarityLevel) {
  return level === "alta" ? 0 : 1;
}

function getTokenOverlap(source: string, target: string) {
  const sourceTokens = new Set(
    source.split(" ").filter((token) => token.length >= 3),
  );
  const targetTokens = new Set(
    target.split(" ").filter((token) => token.length >= 3),
  );

  if (sourceTokens.size === 0 || targetTokens.size === 0) return 0;

  let matches = 0;
  sourceTokens.forEach((sourceToken) => {
    const hasMatch = [...targetTokens].some(
      (targetToken) =>
        targetToken.includes(sourceToken) || sourceToken.includes(targetToken),
    );
    if (hasMatch) matches += 1;
  });

  return matches / sourceTokens.size;
}
