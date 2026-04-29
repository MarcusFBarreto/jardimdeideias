"use client";

import { Idea } from "@/lib/types";
import { getIdeaStatus } from "@/lib/ideaMetrics";
import {
  getIdeaSupportCount,
  getLeadingVariation,
  getSeedTitle,
  getVariationCount,
} from "@/lib/ideaModel";

type IdeaListProps = {
  ideas: Idea[];
  selectedIdeaId: string | null;
  title?: string;
  description?: string;
  onSelectIdea: (ideaId: string) => void;
};

export function IdeaList({
  ideas,
  selectedIdeaId,
  title = "Ideias em movimento",
  description = "Abra uma ideia, entenda o ponto e veja como melhorar.",
  onSelectIdea,
}: IdeaListProps) {
  return (
    <section className="related-ideas" aria-label="Ideias para explorar">
      <div className="related-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="idea-list">
        {ideas.length === 0 ? (
          <p className="empty-state">Nada por aqui ainda.</p>
        ) : (
          ideas.map((idea) => {
            const leadingVariation = getLeadingVariation(idea);

            return (
              <button
                className={`idea-card ${
                  selectedIdeaId === idea.id ? "is-selected" : ""
                }`}
                key={idea.id}
                onClick={() => onSelectIdea(idea.id)}
                type="button"
              >
                <div className="idea-card-header">
                  <h3>{getSeedTitle(idea)}</h3>
                  <span>Variação líder</span>
                </div>
                <p className="idea-description">{leadingVariation?.content}</p>
                <div className="meta-row">
                  <span>Score {idea.score}</span>
                  <span aria-hidden="true">•</span>
                  <span>{getIdeaSupportCount(idea)} apoios</span>
                  <span aria-hidden="true">•</span>
                  <span>{idea.evolutions.length} evoluções</span>
                  <span aria-hidden="true">•</span>
                  <span>{getVariationCount(idea)} caminhos</span>
                  <span aria-hidden="true">•</span>
                  <span>{getIdeaStatus(idea)}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
