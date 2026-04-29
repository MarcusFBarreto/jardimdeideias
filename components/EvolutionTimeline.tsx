import { Evolution } from "@/lib/types";
import { sortEvolutionsByNewest } from "@/lib/ideaMetrics";

type EvolutionTimelineProps = {
  evolutions: Evolution[];
};

export const typeLabels: Record<Evolution["type"], string> = {
  melhoria: "Melhoria",
  critica: "Crítica",
  variacao: "Variação",
  aplicacao: "Aplicação",
};

export const impactLabels: Record<NonNullable<Evolution["impact"]>, string> = {
  baixo: "Impacto baixo",
  medio: "Impacto médio",
  alto: "Impacto alto",
};

export function EvolutionTimeline({ evolutions }: EvolutionTimelineProps) {
  if (evolutions.length === 0) {
    return (
      <p className="empty-state">
        Nada mudou por aqui ainda. Você pode puxar a primeira melhoria.
      </p>
    );
  }

  return (
    <ol className="timeline">
      {sortEvolutionsByNewest(evolutions).map((evolution) => (
        <li key={evolution.id}>
          <div className="timeline-marker" aria-hidden="true" />
          <div className="timeline-content">
            <div className="timeline-meta">
              <span>{typeLabels[evolution.type]}</span>
              {evolution.impact ? (
                <span className="impact-badge">
                  {impactLabels[evolution.impact]}
                </span>
              ) : null}
              <time dateTime={evolution.createdAt}>
                {formatDate(evolution.createdAt)}
              </time>
            </div>
            <p>{evolution.content}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
