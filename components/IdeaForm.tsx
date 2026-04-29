"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { NewIdeaInput } from "@/lib/types";

type IdeaFormProps = {
  initialIdea?: NewIdeaInput;
  onCreate: (idea: NewIdeaInput) => void;
};

const emptyIdea: NewIdeaInput = {
  title: "",
  description: "",
  problem: "",
};

export function IdeaForm({ initialIdea, onCreate }: IdeaFormProps) {
  const [form, setForm] = useState<NewIdeaInput>(emptyIdea);

  useEffect(() => {
    if (initialIdea) setForm(initialIdea);
  }, [initialIdea]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.problem.trim()) {
      return;
    }

    onCreate(form);
    setForm(emptyIdea);
  }

  return (
    <section className="panel form-panel" aria-label="Nova ideia">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Nova semente</p>
          <h2>Solte a ideia</h2>
        </div>
      </div>

      <form className="stacked-form" onSubmit={handleSubmit}>
        <label>
          Ideia semente
          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Ex.: Biblioteca de ferramentas compartilhadas"
          />
        </label>

        <label>
          Variação inicial
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Descreva a primeira direção possível para essa semente"
            rows={4}
          />
        </label>

        <label>
          Ponto a resolver
          <textarea
            value={form.problem}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                problem: event.target.value,
              }))
            }
            placeholder="Que problema essa ideia tenta resolver?"
            rows={4}
          />
        </label>

        <button className="primary-button" type="submit">
          <Plus size={18} aria-hidden="true" />
          Colocar no ar
        </button>
      </form>
    </section>
  );
}
