"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createManualTopic,
  getActiveInspirationTopics,
  loadInspirationTopics,
  saveInspirationTopics,
} from "@/lib/inspirationTopics";
import { InspirationTopic } from "@/lib/types";

export function useInspirationTopics() {
  const [topics, setTopics] = useState<InspirationTopic[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTopics(loadInspirationTopics());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveInspirationTopics(topics);
  }, [isLoaded, topics]);

  const activeTopics = useMemo(() => getActiveInspirationTopics(topics), [topics]);

  function addManualTopic(input: Pick<InspirationTopic, "title" | "angle" | "problem">) {
    const topic = createManualTopic(input);
    setTopics((currentTopics) => [topic, ...currentTopics]);
    return topic;
  }

  return {
    activeTopics,
    addManualTopic,
  };
}
