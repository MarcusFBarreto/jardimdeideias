"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { NewIdeaInput } from "@/lib/types";

type IdeaFormProps = {
  onCreate: (idea: NewIdeaInput) => void;
};

export function IdeaForm({ onCreate }: IdeaFormProps) {
  const [form, setForm] = useState<NewIdeaInput>({
    title: "",
    description: "",
    problem: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.problem.trim()) {
      return;
    }

    onCreate(form);
    setForm({ title: "", description: "", problem: "" });
  }

  return (
    <section className="panel form-panel" aria-label="Criar nova ideia">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Nova ideia</p>
          <h2>Plante uma ideia</h2>
        </div>
      </div>

      <form className="stacked-form" onSubmit={handleSubmit}>
        <label>
          Título
          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Ex.: Biblioteca de ferramentas compartilhadas"
          />
        </label>

        <label>
          Descrição
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Explique a proposta de forma breve"
            rows={4}
          />
        </label>

        <label>
          Problema
          <textarea
            value={form.problem}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                problem: event.target.value,
              }))
            }
            placeholder="Qual problema essa ideia resolve?"
            rows={4}
          />
        </label>

        <button className="primary-button" type="submit">
          <Plus size={18} aria-hidden="true" />
          Criar ideia
        </button>
      </form>
    </section>
  );
}
