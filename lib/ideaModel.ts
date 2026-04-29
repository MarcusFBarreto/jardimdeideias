import { Evolution, Idea, Variation } from "@/lib/types";

export function getSeedTitle(idea: Idea) {
  return idea.seedTitle?.trim() || idea.title;
}

export function getIdeaCategoryLabel(idea: Idea, fallbackStatus: string) {
  return idea.category || idea.status || fallbackStatus;
}

export function getIdeaVariations(idea: Idea): Variation[] {
  const storedVariations = idea.variations ?? [];
  const baseVariation: Variation = {
    id: `${idea.id}-root-variation`,
    content: idea.description,
    supports: idea.supports,
    evolutions: idea.evolutions.length,
    createdAt: idea.createdAt,
    isLeading: storedVariations.length === 0,
  };

  const normalizedStoredVariations = storedVariations
    .filter((variation) => variation.content.trim().length > 0)
    .map((variation) => ({
      ...variation,
      supports: variation.supports ?? 0,
      evolutions: variation.evolutions ?? 0,
    }));

  if (
    normalizedStoredVariations.some(
      (variation) => variation.content.trim() === idea.description.trim(),
    )
  ) {
    return normalizedStoredVariations;
  }

  return [baseVariation, ...normalizedStoredVariations];
}

export function getLeadingVariation(idea: Idea) {
  return getIdeaVariations(idea).sort(
    (a, b) =>
      b.supports - a.supports ||
      (b.evolutions ?? 0) - (a.evolutions ?? 0) ||
      new Date(b.createdAt ?? idea.createdAt).getTime() -
        new Date(a.createdAt ?? idea.createdAt).getTime(),
  )[0];
}

export function getOtherVariations(idea: Idea) {
  const leadingVariation = getLeadingVariation(idea);

  return getIdeaVariations(idea).filter(
    (variation) => variation.id !== leadingVariation?.id,
  );
}

export function getVariationCount(idea: Idea) {
  return getIdeaVariations(idea).length;
}

export function getIdeaSupportCount(idea: Idea) {
  return getIdeaVariations(idea).reduce(
    (total, variation) => total + variation.supports,
    0,
  );
}

export function normalizeIdeaShape(idea: Idea): Idea {
  const seedTitle = getSeedTitle(idea);
  const variationEvolutions = idea.evolutions
    .filter((evolution) => evolution.type === "variacao")
    .map((evolution, index) => evolutionToVariation(evolution, index));
  const existingVariations = idea.variations ?? [];
  const variations = [
    {
      id: `${idea.id}-root-variation`,
      content: idea.description,
      supports: Math.max(idea.supports, 1),
      evolutions: idea.evolutions.length,
      createdAt: idea.createdAt,
    },
    ...existingVariations,
    ...variationEvolutions,
  ].reduce<Variation[]>((uniqueVariations, variation) => {
    const normalizedContent = variation.content.trim();
    const alreadyExists = uniqueVariations.some(
      (current) => current.content.trim() === normalizedContent,
    );

    if (!alreadyExists && normalizedContent) {
      uniqueVariations.push(variation);
    }

    return uniqueVariations;
  }, []);

  const leadingVariation = variations.sort((a, b) => b.supports - a.supports)[0];

  return {
    ...idea,
    title: idea.title || seedTitle,
    seedTitle,
    variations: variations.map((variation) => ({
      ...variation,
      isLeading: variation.id === leadingVariation?.id,
    })),
  };
}

function evolutionToVariation(evolution: Evolution, index: number): Variation {
  return {
    id: `${evolution.id}-variation`,
    content: evolution.content,
    supports: Math.max(1, 3 - index),
    evolutions: 0,
    createdAt: evolution.createdAt,
  };
}
