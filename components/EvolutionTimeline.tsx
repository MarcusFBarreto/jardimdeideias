import { Evolution } from "@/lib/types";

type EvolutionTimelineProps = {
  evolutions: Evolution[];
};

const typeLabels: Record<Evolution["type"], string> = {
  melhoria: "Melhoria",
  critica: "Crítica",
  variacao: "Variação",
  aplicacao: "Aplicação",
};

export function EvolutionTimeline({ evolutions }: EvolutionTimelineProps) {
  if (evolutions.length === 0) {
    return (
      <p className="empty-state">
        Ainda não há evoluções. Adicione a primeira contribuição estruturada.
      </p>
    );
  }

  return (
    <ol className="timeline">
      {evolutions.map((evolution) => (
        <li key={evolution.id}>
          <div className="timeline-marker" aria-hidden="true" />
          <div className="timeline-content">
            <div className="timeline-meta">
              <span>{typeLabels[evolution.type]}</span>
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
