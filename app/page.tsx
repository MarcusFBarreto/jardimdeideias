"use client";

import { useMemo, useState } from "react";
import { IdeaDetail } from "@/components/IdeaDetail";
import { IdeaFeed } from "@/components/IdeaFeed";
import { IdeaForm } from "@/components/IdeaForm";
import { useIdeas } from "@/lib/useIdeas";

export default function Home() {
  const {
    ideas,
    isLoaded,
    addIdea,
    supportIdea,
    addEvolution,
    getIdeaById,
  } = useIdeas();
  const [query, setQuery] = useState("");
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  const selectedIdea = selectedIdeaId ? getIdeaById(selectedIdeaId) : null;

  const filteredIdeas = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchingIdeas = normalizedQuery
      ? ideas.filter((idea) =>
          [idea.title, idea.description, idea.problem]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : ideas;

    return [...matchingIdeas].sort((a, b) => {
      const scoreDiff = b.score - a.score;
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [ideas, query]);

  if (!isLoaded) {
    return (
      <main className="shell">
        <p className="loading">Carregando ideias...</p>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="intro">
        <div>
          <p className="eyebrow">Rede social de ideias</p>
          <h1>Jardim de Ideias</h1>
          <p>
            Crie, explore, apoie e evolua ideias com uma timeline simples de
            melhorias, críticas, variações e aplicações.
          </p>
        </div>
      </section>

      <section className="workspace">
        <div className="feed-column">
          <IdeaFeed
            ideas={filteredIdeas}
            query={query}
            selectedIdeaId={selectedIdeaId}
            onQueryChange={setQuery}
            onSelectIdea={setSelectedIdeaId}
          />
        </div>

        <div className="detail-column">
          {selectedIdea ? (
            <IdeaDetail
              idea={selectedIdea}
              onBack={() => setSelectedIdeaId(null)}
              onSupport={supportIdea}
              onAddEvolution={addEvolution}
            />
          ) : (
            <IdeaForm
              onCreate={(data) => {
                const idea = addIdea(data);
                setSelectedIdeaId(idea.id);
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}
