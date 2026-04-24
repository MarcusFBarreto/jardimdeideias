"use client";

import { ArrowLeft, Heart, Plus } from "lucide-react";
import { EvolutionForm } from "@/components/EvolutionForm";
import { EvolutionTimeline } from "@/components/EvolutionTimeline";
import { Idea, NewEvolutionInput } from "@/lib/types";

type IdeaDetailProps = {
  idea: Idea;
  onBack: () => void;
  onSupport: (ideaId: string) => void;
  onAddEvolution: (ideaId: string, evolution: NewEvolutionInput) => void;
};

export function IdeaDetail({
  idea,
  onBack,
  onSupport,
  onAddEvolution,
}: IdeaDetailProps) {
  return (
    <section className="panel detail-panel" aria-label="Detalhes da ideia">
      <button className="ghost-button back-button" onClick={onBack} type="button">
        <ArrowLeft size={18} aria-hidden="true" />
        Criar outra ideia
      </button>

      <article className="idea-detail">
        <div className="detail-topline">
          <span>Score {idea.score}</span>
          <span>{formatDate(idea.createdAt)}</span>
        </div>

        <h2>{idea.title}</h2>
        <p className="lead">{idea.description}</p>

        <div className="problem-box">
          <strong>Problema</strong>
          <p>{idea.problem}</p>
        </div>

        <div className="actions-row">
          <button
            className="primary-button"
            onClick={() => onSupport(idea.id)}
            type="button"
          >
            <Heart size={18} aria-hidden="true" />
            Apoiar
          </button>
          <span>{idea.supports} apoios</span>
          <span>{idea.evolutions.length} evoluções</span>
        </div>
      </article>

      <EvolutionForm
        onCreate={(evolution) => onAddEvolution(idea.id, evolution)}
      />

      <div className="timeline-heading">
        <Plus size={18} aria-hidden="true" />
        <h3>Timeline de evoluções</h3>
      </div>
      <EvolutionTimeline evolutions={idea.evolutions} />
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
