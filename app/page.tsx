"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { IdeaDetail } from "@/components/IdeaDetail";
import { IdeaFeed } from "@/components/IdeaFeed";
import { IdeaForm } from "@/components/IdeaForm";
import { InspirationPanel } from "@/components/InspirationPanel";
import { topicToIdeaDraft } from "@/lib/inspirationTopics";
import { FeedTab, NewIdeaInput } from "@/lib/types";
import { useIdeas } from "@/lib/useIdeas";
import { useInspirationTopics } from "@/lib/useInspirationTopics";

export default function Home() {
  const {
    ideas,
    isLoaded,
    addIdea,
    supportIdea,
    addEvolution,
    getIdeaById,
  } = useIdeas();
  const { activeTopics, addManualTopic } = useInspirationTopics();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FeedTab>("trending");
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [ideaDraft, setIdeaDraft] = useState<NewIdeaInput | undefined>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
      const newestDiff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      if (activeTab === "new") return newestDiff;

      if (activeTab === "evolving") {
        const evolutionDiff = b.evolutions.length - a.evolutions.length;
        return evolutionDiff || newestDiff;
      }

      const scoreDiff = b.score - a.score;
      return scoreDiff || newestDiff;
    });
  }, [activeTab, ideas, query]);

  if (!isLoaded) {
    return (
      <main className="shell">
        <p className="loading">Carregando boas ideias...</p>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="intro">
        <div>
          <p className="top-slogan">
            <strong>Jardim de Ideias</strong> · ideias vivas, melhoradas por
            pessoas
          </p>
          <p className="top-belief">Sua ideia pode melhorar o mundo.</p>
        </div>
        <a href="#sobre">O que é isso?</a>
      </section>

      <section className="workspace">
        <div className="feed-column">
          <IdeaFeed
            activeTab={activeTab}
            ideas={filteredIdeas}
            ideaCount={filteredIdeas.length}
            query={query}
            selectedIdeaId={selectedIdeaId}
            onCreateIdea={() => {
              setIdeaDraft(undefined);
              setIsCreateOpen(true);
            }}
            onTabChange={setActiveTab}
            onQueryChange={setQuery}
            onSelectIdea={setSelectedIdeaId}
          />
        </div>

        <div className="detail-column">
          <InspirationPanel
            topics={activeTopics}
            onAddTopic={addManualTopic}
            onUseInspiration={(topic) => {
              setIdeaDraft(topicToIdeaDraft(topic));
              setSelectedIdeaId(null);
              setIsCreateOpen(true);
            }}
          />
        </div>
      </section>

      <section className="about-section" id="sobre">
        <p className="eyebrow">O que é isso?</p>
        <h2>Jardim de Ideias</h2>
        <p>
          É um lugar para colocar ideias na mesa. Pode ser uma ideia pequena,
          uma solução para o bairro, um jeito novo de aprender, vender, cuidar,
          brincar ou resolver um problema antigo.
        </p>
        <p>
          Aqui, uma ideia não precisa nascer perfeita. Ela pode começar simples,
          receber apoio, ganhar melhorias e mudar de forma com a ajuda de outras
          pessoas.
        </p>
        <div className="about-points">
          <article>
            <h3>Para quem teve uma ideia</h3>
            <p>Escreva o que pensou, conte o problema e coloque no ar.</p>
          </article>
          <article>
            <h3>Para quem quer ajudar</h3>
            <p>Apoie, critique com cuidado ou sugira um caminho melhor.</p>
          </article>
          <article>
            <h3>Para quem só quer explorar</h3>
            <p>Abra uma ideia, entenda o ponto e veja como ela está mudando.</p>
          </article>
        </div>
        <p>
          A regra é simples: boas ideias ficam mais fortes quando pessoas livres
          olham para elas com atenção.
        </p>
      </section>

      {selectedIdea ? (
        <div className="modal-backdrop reading-backdrop" role="presentation">
          <div
            aria-label="Ideia selecionada"
            aria-modal="true"
            className="reading-modal"
            role="dialog"
          >
            <IdeaDetail
              idea={selectedIdea}
              onBack={() => setSelectedIdeaId(null)}
              onSupport={supportIdea}
              onAddEvolution={addEvolution}
            />
          </div>
        </div>
      ) : null}

      {isCreateOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div
            aria-label="Nova ideia"
            aria-modal="true"
            className="create-modal"
            role="dialog"
          >
            <button
              aria-label="Fechar"
              className="modal-close"
              onClick={() => setIsCreateOpen(false)}
              type="button"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <IdeaForm
              initialIdea={ideaDraft}
              onCreate={(data) => {
                const idea = addIdea(data);
                setIdeaDraft(undefined);
                setIsCreateOpen(false);
                setSelectedIdeaId(idea.id);
              }}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
