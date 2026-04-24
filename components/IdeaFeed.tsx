import { Search } from "lucide-react";
import { Idea } from "@/lib/types";

type IdeaFeedProps = {
  ideas: Idea[];
  query: string;
  selectedIdeaId: string | null;
  onQueryChange: (query: string) => void;
  onSelectIdea: (ideaId: string) => void;
};

export function IdeaFeed({
  ideas,
  query,
  selectedIdeaId,
  onQueryChange,
  onSelectIdea,
}: IdeaFeedProps) {
  return (
    <section className="panel feed-panel" aria-label="Ideias em destaque">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Feed</p>
          <h2>Ideias em destaque</h2>
        </div>
        <span className="count">{ideas.length}</span>
      </div>

      <label className="search-field">
        <Search size={18} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por título, descrição ou problema"
          type="search"
        />
      </label>

      <div className="idea-list">
        {ideas.length === 0 ? (
          <p className="empty-state">Nenhuma ideia encontrada.</p>
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
                <span>{idea.score}</span>
              </div>
              <p>{idea.description}</p>
              <div className="meta-row">
                <span>{idea.supports} apoios</span>
                <span>{idea.evolutions.length} evoluções</span>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
