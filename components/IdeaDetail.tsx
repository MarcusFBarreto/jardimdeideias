"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Plus } from "lucide-react";
import { EvolutionForm } from "@/components/EvolutionForm";
import {
  EvolutionTimeline,
  impactLabels,
  typeLabels,
} from "@/components/EvolutionTimeline";
import { getIdeaStatus, getLatestEvolution } from "@/lib/ideaMetrics";
import { Idea, NewEvolutionInput } from "@/lib/types";

type IdeaDetailProps = {
  idea: Idea;
  onBack?: () => void;
  onSupport: (ideaId: string) => void;
  onAddEvolution: (ideaId: string, evolution: NewEvolutionInput) => void;
};

export function IdeaDetail({
  idea,
  onBack,
  onSupport,
  onAddEvolution,
}: IdeaDetailProps) {
  const latestEvolution = getLatestEvolution(idea.evolutions);
  const [showEvolutionForm, setShowEvolutionForm] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const status = getIdeaStatus(idea);

  useEffect(() => {
    setShowEvolutionForm(false);
    setShowTimeline(false);
  }, [idea.id]);

  return (
    <section className="panel detail-panel" aria-label="Ideia aberta">
      {onBack ? (
        <button
          className="ghost-button back-button"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Fechar ideia
        </button>
      ) : null}

      <article className="idea-detail">
        <p className="eyebrow">Ideia aberta</p>
        <h2>{idea.title}</h2>
        <div className="detail-topline">
          <span className="score-badge">Em alta · score {idea.score}</span>
          <span className="status-badge">{status}</span>
          <time dateTime={idea.createdAt}>{formatDate(idea.createdAt)}</time>
        </div>
        <p className="lead">{idea.description}</p>

        <div className="problem-box">
          <strong>O ponto a resolver</strong>
          <p>{idea.problem}</p>
        </div>

        <div className="idea-stats">
          <span>{idea.supports} apoios</span>
          <span aria-hidden="true">•</span>
          <span>{idea.evolutions.length} evoluções</span>
          <span aria-hidden="true">•</span>
          <span>{status}</span>
        </div>

        <div className="actions-row">
          <button
            className="primary-button support-button"
            onClick={() => onSupport(idea.id)}
            type="button"
          >
            <Heart size={18} aria-hidden="true" />
            Apoiar ideia
          </button>
          <button
            className="text-button"
            onClick={() => setShowTimeline((current) => !current)}
            type="button"
          >
            {showTimeline ? "Esconder evolução" : "Ver o que mudou"}
          </button>
          <button
            className="secondary-button evolve-button"
            onClick={() => setShowEvolutionForm((current) => !current)}
            type="button"
          >
            <Plus size={18} aria-hidden="true" />
            {showEvolutionForm ? "Cancelar" : "Melhorar ideia"}
          </button>
        </div>
      </article>

      {showEvolutionForm ? (
        <EvolutionForm
          onCreate={(evolution) => {
            onAddEvolution(idea.id, evolution);
            setShowEvolutionForm(false);
            setShowTimeline(true);
          }}
        />
      ) : null}

      {showTimeline ? (
        <>
          <section className="latest-evolution" aria-label="Evolução mais recente">
            <h3>Último avanço</h3>
            {latestEvolution ? (
              <div className="timeline-content">
                <div className="timeline-meta">
                  <span>{typeLabels[latestEvolution.type]}</span>
                  {latestEvolution.impact ? (
                    <span className="impact-badge">
                      {impactLabels[latestEvolution.impact]}
                    </span>
                  ) : null}
                  <time dateTime={latestEvolution.createdAt}>
                    {formatDateTime(latestEvolution.createdAt)}
                  </time>
                </div>
                <p>{latestEvolution.content}</p>
              </div>
            ) : (
              <p className="empty-state">
                Ninguém mexeu nessa ideia ainda.
              </p>
            )}
          </section>

          <div className="timeline-heading">
            <Plus size={18} aria-hidden="true" />
            <h3>Como a ideia mudou</h3>
          </div>
          <EvolutionTimeline evolutions={idea.evolutions} />
        </>
      ) : null}
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
