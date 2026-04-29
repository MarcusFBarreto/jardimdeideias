"use client";

import { useEffect, useState } from "react";
import {
  createEvolution,
  createIdea,
  createVariation,
  loadIdeas,
  recalculateIdeaScore,
  saveIdeas,
  supportLeadingVariation,
  supportVariation,
} from "@/lib/ideaStore";
import { Idea, NewEvolutionInput, NewIdeaInput } from "@/lib/types";

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIdeas(loadIdeas());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveIdeas(ideas);
  }, [ideas, isLoaded]);

  function addIdea(input: NewIdeaInput) {
    const idea = createIdea(input);
    setIdeas((currentIdeas) => [idea, ...currentIdeas]);
    return idea;
  }

  function supportIdea(ideaId: string) {
    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === ideaId ? supportLeadingVariation(idea) : idea,
      ),
    );
  }

  function supportIdeaVariation(ideaId: string, variationId: string) {
    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === ideaId ? supportVariation(idea, variationId) : idea,
      ),
    );
  }

  function addEvolution(ideaId: string, input: NewEvolutionInput) {
    const evolution = createEvolution(input);
    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === ideaId
          ? recalculateIdeaScore({
              ...idea,
              evolutions: [evolution, ...idea.evolutions],
              variations:
                input.type === "variacao"
                  ? [createVariation({ content: input.content }), ...(idea.variations ?? [])]
                  : idea.variations,
            })
          : idea,
      ),
    );
  }

  function getIdeaById(ideaId: string) {
    return ideas.find((idea) => idea.id === ideaId) ?? null;
  }

  return {
    ideas,
    isLoaded,
    addIdea,
    supportIdea,
    supportIdeaVariation,
    addEvolution,
    getIdeaById,
  };
}
