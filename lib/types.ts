export type EvolutionType = "melhoria" | "critica" | "variacao" | "aplicacao";
export type EvolutionImpact = "baixo" | "medio" | "alto";
export type IdeaStatus = "Nova" | "Em evolução" | "Madura";
export type FeedTab = "trending" | "new" | "evolving";

export type InspirationTopic = {
  id: string;
  title: string;
  angle: string;
  problem: string;
  active: boolean;
  createdAt: string;
  source: "curated" | "manual" | "automation";
};

export type Evolution = {
  id: string;
  type: EvolutionType;
  content: string;
  impact?: EvolutionImpact;
  createdAt: string;
};

export type Idea = {
  id: string;
  title: string;
  description: string;
  problem: string;
  supports: number;
  score: number;
  createdAt: string;
  evolutions: Evolution[];
};

export type NewIdeaInput = {
  title: string;
  description: string;
  problem: string;
};

export type NewEvolutionInput = {
  type: EvolutionType;
  content: string;
  impact?: EvolutionImpact;
};
