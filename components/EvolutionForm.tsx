"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { EvolutionType, NewEvolutionInput } from "@/lib/types";

const evolutionTypes: Array<{ label: string; value: EvolutionType }> = [
  { label: "Melhoria", value: "melhoria" },
  { label: "Crítica", value: "critica" },
  { label: "Variação", value: "variacao" },
  { label: "Aplicação", value: "aplicacao" },
];

type EvolutionFormProps = {
  onCreate: (evolution: NewEvolutionInput) => void;
};

export function EvolutionForm({ onCreate }: EvolutionFormProps) {
  const [type, setType] = useState<EvolutionType>("melhoria");
  const [content, setContent] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;

    onCreate({ type, content });
    setType("melhoria");
    setContent("");
  }

  return (
    <form className="evolution-form" onSubmit={handleSubmit}>
      <label>
        Tipo de evolução
        <select
          value={type}
          onChange={(event) => setType(event.target.value as EvolutionType)}
        >
          {evolutionTypes.map((evolutionType) => (
            <option key={evolutionType.value} value={evolutionType.value}>
              {evolutionType.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Conteúdo
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Descreva uma melhoria, crítica, variação ou aplicação"
          rows={4}
        />
      </label>

      <button className="secondary-button" type="submit">
        <Send size={18} aria-hidden="true" />
        Adicionar evolução
      </button>
    </form>
  );
}
