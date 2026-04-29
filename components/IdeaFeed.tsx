"use client";

import { Plus, Search } from "lucide-react";
import { IdeaList } from "@/components/IdeaList";
import { FeedTab, Idea } from "@/lib/types";

const feedTabs: Array<{ label: string; value: FeedTab }> = [
  { label: "Em alta", value: "trending" },
  { label: "Recentes", value: "new" },
  { label: "Mexidas", value: "evolving" },
];

type IdeaFeedProps = {
  activeTab: FeedTab;
  ideas: Idea[];
  ideaCount: number;
  query: string;
  selectedIdeaId: string | null;
  onCreateIdea: () => void;
  onTabChange: (tab: FeedTab) => void;
  onQueryChange: (query: string) => void;
  onSelectIdea: (ideaId: string) => void;
};

export function IdeaFeed({
  activeTab,
  ideas,
  ideaCount,
  query,
  selectedIdeaId,
  onCreateIdea,
  onTabChange,
  onQueryChange,
  onSelectIdea,
}: IdeaFeedProps) {
  return (
    <section className="panel feed-panel" aria-label="Explorar ideias">
      <div className="feed-tabs" role="tablist" aria-label="Ordenação do feed">
        {feedTabs.map((tab) => (
          <button
            aria-selected={activeTab === tab.value}
            className={activeTab === tab.value ? "is-active" : ""}
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <label className="search-field">
        <Search size={18} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Busque por título, resumo ou problema"
          type="search"
        />
      </label>

      <button className="create-idea-trigger sidebar-create" onClick={onCreateIdea} type="button">
        <Plus size={18} aria-hidden="true" />
        Criar ideia
      </button>

      <p className="sidebar-count">{ideaCount} ideias na tela</p>
      <IdeaList
        ideas={ideas}
        selectedIdeaId={selectedIdeaId}
        onSelectIdea={onSelectIdea}
      />
    </section>
  );
}
