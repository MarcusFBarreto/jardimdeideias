"use client";

import { FormEvent, useState } from "react";
import { Lightbulb } from "lucide-react";
import { InspirationTopic } from "@/lib/types";

type InspirationPanelProps = {
  topics: InspirationTopic[];
  onAddTopic: (
    topic: Pick<InspirationTopic, "title" | "angle" | "problem">,
  ) => void;
  onUseInspiration: (topic: InspirationTopic) => void;
};

export function InspirationPanel({
  topics,
  onAddTopic,
  onUseInspiration,
}: InspirationPanelProps) {
  const [topicForm, setTopicForm] = useState({
    title: "",
    angle: "",
    problem: "",
  });

  function handleTopicSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !topicForm.title.trim() ||
      !topicForm.angle.trim() ||
      !topicForm.problem.trim()
    ) {
      return;
    }

    onAddTopic(topicForm);
    setTopicForm({ title: "", angle: "", problem: "" });
  }

  return (
    <section className="inspiration-main" aria-label="Ideias para puxar">
      <div className="inspiration-main-heading">
        <p className="eyebrow">Ideias para puxar</p>
        <h2>Comece por um tema vivo</h2>
        <p>
          Comece com algo simples: sua ideia é uma semente, e outras pessoas
          podem ajudar ela a virar algo maior e mais interessante.
        </p>
      </div>

      <div className="inspiration-grid">
        {topics.map((topic) => (
          <button
            className="inspiration-feature"
            key={topic.id}
            onClick={() => onUseInspiration(topic)}
            type="button"
          >
            <Lightbulb size={18} aria-hidden="true" />
            <span>{topic.title}</span>
            <small>{topic.angle}</small>
          </button>
        ))}
      </div>

      <details className="topic-details inspiration-topic-details">
        <summary>Guardar um tema</summary>
        <form className="topic-form" onSubmit={handleTopicSubmit}>
          <input
            value={topicForm.title}
            onChange={(event) =>
              setTopicForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="Nome do tema"
          />
          <input
            value={topicForm.angle}
            onChange={(event) =>
              setTopicForm((current) => ({
                ...current,
                angle: event.target.value,
              }))
            }
            placeholder="Que caminho ele abre?"
          />
          <input
            value={topicForm.problem}
            onChange={(event) =>
              setTopicForm((current) => ({
                ...current,
                problem: event.target.value,
              }))
            }
            placeholder="Que problema ele cutuca?"
          />
          <button type="submit">Guardar tema</button>
        </form>
      </details>
    </section>
  );
}
