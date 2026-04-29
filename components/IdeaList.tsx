"use client";

import { Idea } from "@/lib/types";
import { getIdeaStatus } from "@/lib/ideaMetrics";

type IdeaListProps = {
  ideas: Idea[];
  selectedIdeaId: string | null;
  onSelectIdea: (ideaId: string) => void;
};

export function IdeaList({ ideas, selectedIdeaId, onSelectIdea }: IdeaListProps) {
  return (
    <section className="related-ideas" aria-label="Ideias para explorar">
      <div className="related-heading">
        <h2>Ideias em movimento</h2>
        <p>Abra uma ideia, entenda o ponto e veja como melhorar.</p>
      </div>

      <div className="idea-list">
        {ideas.length === 0 ? (
          <p className="empty-state">Nada por aqui ainda.</p>
        ) : (
          ideas.map((idea) => (
            <button
              className={`idea-card ${
                selectedIdeaId === idea.id ? "is-selected" : ""
              }`}
              key={idea.id}
              onClick={() => onSelectIdea(idea.id)}
              type="button"
            >
              <div className="idea-card-header">
                <h3>{idea.title}</h3>
              </div>
              <p className="idea-description">{idea.description}</p>
              <div className="meta-row">
                <span>Score {idea.score}</span>
                <span aria-hidden="true">•</span>
                <span>{idea.supports} apoios</span>
                <span aria-hidden="true">•</span>
                <span>{idea.evolutions.length} evoluções</span>
                <span aria-hidden="true">•</span>
                <span>{getIdeaStatus(idea)}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
