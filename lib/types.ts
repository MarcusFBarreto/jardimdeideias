export type EvolutionType = "melhoria" | "critica" | "variacao" | "aplicacao";

export type Evolution = {
  id: string;
  type: EvolutionType;
  content: string;
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
};
