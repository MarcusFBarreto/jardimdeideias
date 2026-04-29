"use client";

import { FormEvent, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { EvolutionImpact, EvolutionType, NewEvolutionInput } from "@/lib/types";

const evolutionTypes: Array<{ label: string; value: EvolutionType }> = [
  { label: "Melhoria", value: "melhoria" },
  { label: "Crítica", value: "critica" },
  { label: "Variação", value: "variacao" },
  { label: "Aplicação", value: "aplicacao" },
];

const impactOptions: Array<{ label: string; value: EvolutionImpact }> = [
  { label: "Baixo", value: "baixo" },
  { label: "Médio", value: "medio" },
  { label: "Alto", value: "alto" },
];

type EvolutionFormProps = {
  initialType?: EvolutionType;
  onCreate: (evolution: NewEvolutionInput) => void;
};

export function EvolutionForm({
  initialType = "melhoria",
  onCreate,
}: EvolutionFormProps) {
  const [type, setType] = useState<EvolutionType>(initialType);
  const [impact, setImpact] = useState<EvolutionImpact | "">("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;

    onCreate({ type, content, impact: impact || undefined });
    setType(initialType);
    setImpact("");
    setContent("");
  }

  return (
    <form className="evolution-form" onSubmit={handleSubmit}>
      <label>
        Tipo de melhoria
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
        Impacto, se tiver
        <select
          value={impact}
          onChange={(event) =>
            setImpact(event.target.value as EvolutionImpact | "")
          }
        >
          <option value="">Sem impacto definido</option>
          {impactOptions.map((impactOption) => (
            <option key={impactOption.value} value={impactOption.value}>
              {impactOption.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Conteúdo
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escreva uma melhoria, crítica, variação ou uso possível"
          rows={4}
        />
      </label>

      <button className="secondary-button" type="submit">
        <Send size={18} aria-hidden="true" />
        {type === "variacao" ? "Propor variação" : "Enviar melhoria"}
      </button>
    </form>
  );
}
