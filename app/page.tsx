"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Plus, Search, X } from "lucide-react";
import { IdeaDetail } from "@/components/IdeaDetail";
import { IdeaForm } from "@/components/IdeaForm";
import { InspirationPanel } from "@/components/InspirationPanel";
import { IdeaList } from "@/components/IdeaList";
import { getLatestEvolution } from "@/lib/ideaMetrics";
import {
  getIdeaCategoryLabel,
  getIdeaSupportCount,
  getLeadingVariation,
  getOtherVariations,
  getSeedTitle,
  getVariationCount,
} from "@/lib/ideaModel";
import {
  findSimilarIdeas,
  normalizeIdeaText,
  SimilarIdea,
} from "@/lib/ideaSimilarity";
import { topicToIdeaDraft } from "@/lib/inspirationTopics";
import { FeedTab, Idea, NewIdeaInput } from "@/lib/types";
import { useIdeas } from "@/lib/useIdeas";
import { useInspirationTopics } from "@/lib/useInspirationTopics";

const feedTabs: Array<{ label: string; value: FeedTab }> = [
  { label: "Em alta", value: "trending" },
  { label: "Novas sementes", value: "new" },
  { label: "Mais evoluídas", value: "evolving" },
];

const MIN_SEARCH_LENGTH = 3;

type SearchableIdea = Idea & {
  normalizedCategory: string;
  normalizedDescription: string;
  normalizedProblem: string;
  normalizedStatus: string;
  normalizedTitle: string;
  normalizedVariations: string;
};

function getEditorialStatus(idea: Idea) {
  if (idea.evolutions.length >= 5) return "virando proposta";
  if (idea.evolutions.some((evolution) => evolution.type === "critica")) {
    return "em debate";
  }
  return "em alta";
}

function sortIdeas(ideas: Idea[], activeTab: FeedTab) {
  return [...ideas].sort((a, b) => {
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
}

function getSearchableIdeas(ideas: Idea[]): SearchableIdea[] {
  return ideas.map((idea) => ({
    ...idea,
    normalizedCategory: normalizeIdeaText(
      getIdeaCategoryLabel(idea, getEditorialStatus(idea)),
    ),
    normalizedDescription: normalizeIdeaText(
      `${idea.description} ${getLeadingVariation(idea)?.content ?? ""}`,
    ),
    normalizedProblem: normalizeIdeaText(idea.problem),
    normalizedStatus: normalizeIdeaText(getEditorialStatus(idea)),
    normalizedTitle: normalizeIdeaText(getSeedTitle(idea)),
    normalizedVariations: normalizeIdeaText(
      getOtherVariations(idea)
        .map((variation) => `${variation.title ?? ""} ${variation.content}`)
        .join(" "),
    ),
  }));
}

function searchIdeas(ideas: Idea[], searchTerm: string) {
  const normalizedSearch = normalizeIdeaText(searchTerm);
  if (normalizedSearch.length < MIN_SEARCH_LENGTH) return [];

  const searchableIdeas = getSearchableIdeas(ideas);
  const fuse = new Fuse(searchableIdeas, {
    includeScore: true,
    ignoreLocation: true,
    keys: [
      { name: "normalizedTitle", weight: 0.48 },
      { name: "normalizedDescription", weight: 0.22 },
      { name: "normalizedVariations", weight: 0.18 },
      { name: "normalizedProblem", weight: 0.18 },
      { name: "normalizedCategory", weight: 0.08 },
      { name: "normalizedStatus", weight: 0.04 },
    ],
    minMatchCharLength: MIN_SEARCH_LENGTH,
    threshold: 0.38,
  });

  const exactTitleMatches = searchableIdeas
    .filter((idea) => idea.normalizedTitle === normalizedSearch)
    .map((idea) => ({ idea, rank: 0, score: 0 }));
  const partialTitleMatches = searchableIdeas
    .filter(
      (idea) =>
        idea.normalizedTitle !== normalizedSearch &&
        idea.normalizedTitle.includes(normalizedSearch),
    )
    .map((idea) => ({ idea, rank: 1, score: 0.05 }));
  const fuzzyMatches = fuse.search(normalizedSearch).map((result) => {
    const isTitleMatch = result.item.normalizedTitle
      .split(" ")
      .some((token) => token.includes(normalizedSearch));
    const isDescriptionMatch =
      result.item.normalizedDescription.includes(normalizedSearch) ||
      result.item.normalizedVariations.includes(normalizedSearch) ||
      result.item.normalizedProblem.includes(normalizedSearch);

    return {
      idea: result.item,
      rank: isTitleMatch ? 2 : isDescriptionMatch ? 3 : 4,
      score: result.score ?? 1,
    };
  });

  return [...exactTitleMatches, ...partialTitleMatches, ...fuzzyMatches]
    .reduce<Array<{ idea: SearchableIdea; rank: number; score: number }>>(
      (uniqueMatches, match) => {
        const existingIndex = uniqueMatches.findIndex(
          (current) => current.idea.id === match.idea.id,
        );

        if (existingIndex === -1) {
          uniqueMatches.push(match);
          return uniqueMatches;
        }

        const existing = uniqueMatches[existingIndex];
        if (
          match.rank < existing.rank ||
          (match.rank === existing.rank && match.score < existing.score)
        ) {
          uniqueMatches[existingIndex] = match;
        }

        return uniqueMatches;
      },
      [],
    )
    .sort((a, b) => a.rank - b.rank || a.score - b.score)
    .map((match) => match.idea);
}

export default function Home() {
  const {
    ideas,
    isLoaded,
    addIdea,
    supportIdea,
    supportIdeaVariation,
    addEvolution,
    getIdeaById,
  } = useIdeas();
  const { activeTopics, addManualTopic } = useInspirationTopics();
  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [activeTab, setActiveTab] = useState<FeedTab>("trending");
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [evolutionTargetId, setEvolutionTargetId] = useState<string | null>(null);
  const [ideaDraft, setIdeaDraft] = useState<NewIdeaInput | undefined>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pendingIdea, setPendingIdea] = useState<NewIdeaInput | null>(null);
  const [similarIdeas, setSimilarIdeas] = useState<SimilarIdea[]>([]);
  const [creationNotice, setCreationNotice] = useState("");

  const selectedIdea = selectedIdeaId ? getIdeaById(selectedIdeaId) : null;

  const sortedIdeas = useMemo(() => sortIdeas(ideas, activeTab), [activeTab, ideas]);
  const searchResults = useMemo(
    () => searchIdeas(ideas, submittedSearch),
    [ideas, submittedSearch],
  );
  const searchSuggestions = useMemo(
    () => searchIdeas(ideas, searchInput).slice(0, 4),
    [ideas, searchInput],
  );

  const featuredIdea = sortedIdeas[0] ?? ideas[0];
  const secondaryIdeas = sortedIdeas.filter(
    (idea) => idea.id !== featuredIdea?.id,
  );
  const latestFeaturedEvolution = featuredIdea
    ? getLatestEvolution(featuredIdea.evolutions)
    : null;
  const featuredDebate = featuredIdea?.evolutions.find(
    (evolution) => evolution.type === "critica",
  );
  const featuredLeadingVariation = featuredIdea
    ? getLeadingVariation(featuredIdea)
    : null;
  const trendingIdeas = [...ideas]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const newSeeds = [...ideas]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);
  const evolvedIdeas = [...ideas]
    .sort((a, b) => b.evolutions.length - a.evolutions.length)
    .slice(0, 3);
  const canSearch = normalizeIdeaText(searchInput).length >= MIN_SEARCH_LENGTH;
  const hasSuggestions = canSearch && searchSuggestions.length > 0 && !isSearchOpen;
  const searchTerm = submittedSearch.trim();

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSubmittedSearch("");
    setSearchInput("");
    setSearchMessage("");
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSearch();
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSearch, isSearchOpen]);

  useEffect(() => {
    if (!creationNotice) return;

    const timeoutId = window.setTimeout(() => setCreationNotice(""), 4200);
    return () => window.clearTimeout(timeoutId);
  }, [creationNotice]);

  function submitSearch(term = searchInput) {
    const normalizedTerm = normalizeIdeaText(term);

    if (normalizedTerm.length < MIN_SEARCH_LENGTH) {
      setSearchMessage("Digite pelo menos 3 caracteres para buscar.");
      return;
    }

    const trimmedTerm = term.trim();
    setSearchInput(trimmedTerm);
    setSubmittedSearch(trimmedTerm);
    setSearchMessage("");
    setIsSearchOpen(true);
  }

  function openIdea(ideaId: string) {
    setSelectedIdeaId(ideaId);
    setEvolutionTargetId(null);
  }

  function handleSearchInputChange(nextSearchInput: string) {
    setSearchInput(nextSearchInput);
    if (searchMessage) setSearchMessage("");
  }

  function handleCreateIdeaFromSearch() {
    const title = searchTerm;
    setIdeaDraft({
      title,
      description: "",
      problem: "",
    });
    setIsSearchOpen(false);
    setSubmittedSearch("");
    setSearchInput("");
    setSearchMessage("");
    setIsCreateOpen(true);
  }

  function handleSelectSearchResult(ideaId: string) {
    openIdea(ideaId);
    setIsSearchOpen(false);
    setSubmittedSearch("");
    setSearchInput("");
    setSearchMessage("");
  }

  function publishIdea(data: NewIdeaInput) {
    const idea = addIdea(data);
    setIdeaDraft(undefined);
    setPendingIdea(null);
    setSimilarIdeas([]);
    setIsCreateOpen(false);
    setSelectedIdeaId(idea.id);
    setEvolutionTargetId(null);
    setCreationNotice("Ideia publicada no Jardim.");
  }

  function handleCreateIdeaSubmit(data: NewIdeaInput) {
    const matches = findSimilarIdeas(data, ideas, 5);

    if (matches.length === 0) {
      publishIdea(data);
      return;
    }

    setPendingIdea(data);
    setIdeaDraft(data);
    setSimilarIdeas(matches);
  }

  function handlePublishPendingIdea() {
    if (!pendingIdea) return;
    publishIdea(pendingIdea);
  }

  function handleBackToIdeaForm() {
    if (pendingIdea) setIdeaDraft(pendingIdea);
    setSimilarIdeas([]);
  }

  function handleViewSimilarIdea(ideaId: string, shouldEvolve = false) {
    if (pendingIdea) setIdeaDraft(pendingIdea);
    setSimilarIdeas([]);
    setIsCreateOpen(false);
    setSelectedIdeaId(ideaId);
    setEvolutionTargetId(shouldEvolve ? ideaId : null);
  }

  function openCreateIdea(initialIdea?: NewIdeaInput) {
    setIdeaDraft(initialIdea);
    setPendingIdea(null);
    setSimilarIdeas([]);
    setIsCreateOpen(true);
  }

  function closeCreateIdea() {
    setIsCreateOpen(false);
    setPendingIdea(null);
    setSimilarIdeas([]);
  }

  if (!isLoaded) {
    return (
      <main className="shell">
        <p className="loading">Carregando boas ideias...</p>
      </main>
    );
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand-mark" href="#topo" aria-label="Jardim de Ideias">
          <span aria-hidden="true">J</span>
          Jardim de Ideias
        </a>
        <nav className="topbar-nav" aria-label="Navegação principal">
          <a href="#sobre">Sobre o Jardim</a>
          <a href="#como-funciona">Como funciona</a>
        </nav>
      </header>

      <section className="editorial-hero" id="topo">
        <div className="hero-copy">
          <p className="eyebrow">Tela alfa experimental</p>
          <h1>Explore ideias em movimento</h1>
          <p>
            Tendências reais, problemas concretos e propostas em evolução.
          </p>
        </div>

        <div className="hero-tools" aria-label="Busca e filtros de ideias">
          <form
            className="hero-search-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch();
            }}
          >
            <label className="search-field hero-search">
              <Search size={18} aria-hidden="true" />
              <input
                value={searchInput}
                onChange={(event) => handleSearchInputChange(event.target.value)}
                placeholder="Busque por título, resumo ou problema"
                type="search"
              />
            </label>
            <button
              className="primary-button search-submit"
              disabled={!canSearch}
              type="submit"
            >
              Buscar
            </button>
          </form>
          {searchMessage ? <p className="search-hint">{searchMessage}</p> : null}
          {hasSuggestions ? (
            <div className="search-suggestions" aria-label="Sugestões de busca">
              {searchSuggestions.map((idea) => (
                <button
                  key={idea.id}
                  onClick={() => submitSearch(getSeedTitle(idea))}
                  type="button"
                >
                  {getSeedTitle(idea)}
                </button>
              ))}
            </div>
          ) : null}
          <div className="feed-tabs hero-tabs" role="tablist" aria-label="Ordenação do feed">
            {feedTabs.map((tab) => (
              <button
                aria-selected={activeTab === tab.value}
                className={activeTab === tab.value ? "is-active" : ""}
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            className="create-idea-trigger hero-create"
            onClick={() => {
              openCreateIdea();
            }}
            type="button"
          >
            <Plus size={18} aria-hidden="true" />
            Criar ideia
          </button>
        </div>
      </section>

      {featuredIdea ? (
        <section className="featured-idea" aria-label="Ideia em destaque">
          <div className="featured-main">
            <div className="featured-kicker">
              <span>Ideia em destaque</span>
              <strong>
                {getIdeaCategoryLabel(featuredIdea, getEditorialStatus(featuredIdea))}
              </strong>
            </div>
            <h2>{getSeedTitle(featuredIdea)}</h2>
            <div className="leader-preview">
              <span>Variação líder no momento</span>
              <p>{featuredLeadingVariation?.content}</p>
            </div>
            <div className="featured-actions">
              <button
                className="primary-button"
                onClick={() => openIdea(featuredIdea.id)}
                type="button"
              >
                Abrir ideia
              </button>
            </div>
          </div>

          <aside className="featured-brief" aria-label="Sinais da ideia">
            <div className="featured-stats">
              <article>
                <span>Apoios</span>
                <strong>{getIdeaSupportCount(featuredIdea)}</strong>
              </article>
              <article>
                <span>Evoluções</span>
                <strong>{featuredIdea.evolutions.length}</strong>
              </article>
              <article>
                <span>Caminhos</span>
                <strong>{getVariationCount(featuredIdea)}</strong>
              </article>
            </div>
            {latestFeaturedEvolution ? (
              <div className="featured-note">
                <span>Última evolução</span>
                <p>{latestFeaturedEvolution.content}</p>
              </div>
            ) : null}
            {featuredDebate ? (
              <div className="featured-note">
                <span>Objeção ou debate</span>
                <p>{featuredDebate.content}</p>
              </div>
            ) : null}
          </aside>
        </section>
      ) : null}

      <section className="movement-layout">
        <div className="movement-main">
          <IdeaList
            ideas={secondaryIdeas}
            selectedIdeaId={selectedIdeaId}
            title="Outras ideias em movimento"
            description={`${sortedIdeas.length} ideias na tela, organizadas pelo filtro ativo.`}
            onSelectIdea={openIdea}
          />
        </div>

        <aside className="movement-side" aria-label="Listas editoriais">
          <EditorialList
            title="Ideias em alta"
            ideas={trendingIdeas}
            onSelectIdea={openIdea}
          />
          <EditorialList
            title="Novas sementes"
            ideas={newSeeds}
            onSelectIdea={openIdea}
          />
          <EditorialList
            title="Mais evoluídas"
            ideas={evolvedIdeas}
            onSelectIdea={openIdea}
          />
        </aside>
      </section>

      <section className="workspace">
        <InspirationPanel
          topics={activeTopics}
          onAddTopic={addManualTopic}
          onUseInspiration={(topic) => {
            setSelectedIdeaId(null);
            setEvolutionTargetId(null);
            openCreateIdea(topicToIdeaDraft(topic));
          }}
        />
      </section>

      <footer className="site-footer" id="sobre">
        <div>
          <p className="eyebrow">Sobre o Jardim</p>
          <h2>Jardim de Ideias</h2>
          <p>Criar, apoiar e evoluir ideias.</p>
        </div>
        <div className="footer-copy" id="como-funciona">
          <p>
            Ideias começam simples, recebem apoio, acumulam evoluções e podem
            virar propostas mais claras com críticas cuidadosas.
          </p>
        </div>
      </footer>

      {isSearchOpen ? (
        <SearchResultsOverlay
          ideas={searchResults}
          searchTerm={searchTerm}
          onClose={closeSearch}
          onClear={closeSearch}
          onCreateIdea={handleCreateIdeaFromSearch}
          onSelectIdea={handleSelectSearchResult}
        />
      ) : null}

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
              onBack={() => {
                setSelectedIdeaId(null);
                setEvolutionTargetId(null);
              }}
              onSupport={supportIdea}
              onSupportVariation={supportIdeaVariation}
              onAddEvolution={addEvolution}
              startEvolutionOpen={selectedIdea.id === evolutionTargetId}
              startEvolutionType="variacao"
            />
          </div>
        </div>
      ) : null}

      {isCreateOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div
            aria-label="Nova ideia"
            aria-modal="true"
            className={`create-modal ${
              similarIdeas.length > 0 ? "similarity-modal" : ""
            }`}
            role="dialog"
          >
            <button
              aria-label="Fechar"
              className="modal-close"
              onClick={closeCreateIdea}
              type="button"
            >
              <X size={18} aria-hidden="true" />
            </button>
            {similarIdeas.length > 0 && pendingIdea ? (
              <SimilarIdeasPanel
                similarIdeas={similarIdeas}
                onBackToEdit={handleBackToIdeaForm}
                onPublishAnyway={handlePublishPendingIdea}
                onViewIdea={handleViewSimilarIdea}
              />
            ) : (
              <IdeaForm
                initialIdea={ideaDraft}
                onCreate={handleCreateIdeaSubmit}
              />
            )}
          </div>
        </div>
      ) : null}

      {creationNotice ? (
        <div className="creation-notice" role="status">
          {creationNotice}
        </div>
      ) : null}
    </main>
  );
}

function EditorialList({
  title,
  ideas,
  onSelectIdea,
}: {
  title: string;
  ideas: Idea[];
  onSelectIdea: (ideaId: string) => void;
}) {
  return (
    <section className="editorial-list">
      <h2>{title}</h2>
      <div>
        {ideas.map((idea) => (
          <button key={idea.id} onClick={() => onSelectIdea(idea.id)} type="button">
            <span>{getSeedTitle(idea)}</span>
            <small>
              {getIdeaSupportCount(idea)} apoios · {getVariationCount(idea)} caminhos
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}

function SearchResultsOverlay({
  ideas,
  searchTerm,
  onClose,
  onClear,
  onCreateIdea,
  onSelectIdea,
}: {
  ideas: Idea[];
  searchTerm: string;
  onClose: () => void;
  onClear: () => void;
  onCreateIdea: () => void;
  onSelectIdea: (ideaId: string) => void;
}) {
  return (
    <div className="search-overlay" role="presentation">
      <section
        aria-label="Resultados da busca"
        aria-modal="true"
        className="search-results-panel"
        role="dialog"
      >
        <header className="search-results-header">
          <div>
            <p className="eyebrow">Busca por: {searchTerm}</p>
            <h2>Resultados da busca</h2>
            <p>Ideias encontradas para o tema pesquisado.</p>
          </div>
          <div className="search-results-actions">
            <span>{ideas.length} ideias encontradas</span>
            <button className="secondary-button" onClick={onClose} type="button">
              Voltar ao Jardim
            </button>
            <button className="text-button" onClick={onClear} type="button">
              Limpar busca
            </button>
          </div>
        </header>

        {ideas.length > 0 ? (
          <div className="search-results-grid">
            {ideas.map((idea) => (
              <button
                className="search-result-card"
                key={idea.id}
                onClick={() => onSelectIdea(idea.id)}
                type="button"
              >
                <div className="idea-card-header">
                  <h3>{getSeedTitle(idea)}</h3>
                  <span>Variação líder</span>
                </div>
                <p>{getLeadingVariation(idea)?.content}</p>
                <div className="meta-row">
                  <span>{getIdeaSupportCount(idea)} apoios</span>
                  <span aria-hidden="true">•</span>
                  <span>{idea.evolutions.length} evoluções</span>
                  <span aria-hidden="true">•</span>
                  <span>{getVariationCount(idea)} caminhos</span>
                  <span aria-hidden="true">•</span>
                  <span>Score {idea.score}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="search-empty-state">
            <h3>Nenhuma ideia encontrada para &quot;{searchTerm}&quot;.</h3>
            <p>Você pode transformar esse tema em uma nova semente.</p>
            <div className="search-empty-actions">
              <button className="primary-button" onClick={onCreateIdea} type="button">
                Criar uma ideia com este tema
              </button>
              <button className="secondary-button" onClick={onClose} type="button">
                Voltar ao Jardim
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function SimilarIdeasPanel({
  similarIdeas,
  onBackToEdit,
  onPublishAnyway,
  onViewIdea,
}: {
  similarIdeas: SimilarIdea[];
  onBackToEdit: () => void;
  onPublishAnyway: () => void;
  onViewIdea: (ideaId: string, shouldEvolve?: boolean) => void;
}) {
  return (
    <section className="panel similar-ideas-panel" aria-label="Ideias parecidas">
      <header className="similar-ideas-header">
        <p className="eyebrow">Antes de publicar</p>
        <h2>Ideias parecidas já estão crescendo</h2>
        <p>
          Sua ideia parece se conectar com outras sementes do Jardim. Talvez
          valha apoiar, evoluir ou diferenciar melhor sua proposta.
        </p>
      </header>

      <div className="similar-ideas-list">
        {similarIdeas.map(({ idea, level }) => (
          <article className="similar-idea-card" key={idea.id}>
            <div className="idea-card-header">
              <h3>{getSeedTitle(idea)}</h3>
              <span>{level === "alta" ? "alta similaridade" : "similar"}</span>
            </div>
            <p>{getLeadingVariation(idea)?.content}</p>
            <div className="meta-row">
              <span>{getIdeaSupportCount(idea)} apoios</span>
              <span aria-hidden="true">•</span>
              <span>{idea.evolutions.length} evoluções</span>
              <span aria-hidden="true">•</span>
              <span>{getVariationCount(idea)} caminhos possíveis</span>
              <span aria-hidden="true">•</span>
              <span>{getEditorialStatus(idea)}</span>
            </div>
            <div className="similar-idea-actions">
              <button
                className="secondary-button"
                onClick={() => onViewIdea(idea.id)}
                type="button"
              >
                Ver e apoiar
              </button>
              <button
                className="text-button"
                onClick={() => onViewIdea(idea.id, true)}
                type="button"
              >
                Evoluir esta ideia
              </button>
            </div>
          </article>
        ))}
      </div>

      <footer className="similar-ideas-footer">
        <button className="primary-button" onClick={onPublishAnyway} type="button">
          Publicar mesmo assim
        </button>
        <button className="secondary-button" onClick={onBackToEdit} type="button">
          Voltar e editar
        </button>
      </footer>
    </section>
  );
}
