"use client";

import { useState, type ReactNode } from "react";
import { useProgressStore } from "@/store/progressStore";
import ChallengeDiagramArea from "./ChallengeDiagramArea";

interface KnowledgeCheckProps {
  id: string;
  question: string;
  options: [string, string];
  correctIndex: 0 | 1;
  explanation: string;
  hint?: string;
  diagram?: ReactNode;
  diagramCaption?: string;
}

export default function KnowledgeCheck({
  id,
  question,
  options,
  correctIndex,
  explanation,
  hint,
  diagram,
  diagramCaption,
}: KnowledgeCheckProps) {
  const { markComplete, recordAttempt, resetChallenge, isComplete } =
    useProgressStore();

  const completed = isComplete(id);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = selected === correctIndex;

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelected(index);
    setSubmitted(true);
    recordAttempt(id);
    if (index === correctIndex) {
      markComplete(id);
    }
  };

  const handleTryAgain = () => {
    setSelected(null);
    setSubmitted(false);
  };

  const handleReset = () => {
    resetChallenge(id);
    setSelected(null);
    setSubmitted(false);
    setShowHint(false);
  };

  /* ---- Completed state ---- */
  if (completed) {
    return (
      <div className="rounded-xl border border-docker-teal/30 bg-docker-teal/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-docker-teal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-docker-teal font-semibold text-xs">
              Answered correctly
            </span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-text-muted hover:text-docker-violet transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  /* ---- Active state ---- */
  return (
    <div className="rounded-xl border border-docker-violet/20 bg-docker-violet/5 p-5 space-y-4">
      {/* Question */}
      <p className="text-text-primary font-semibold text-sm">{question}</p>

      {/* Diagram */}
      {diagram && (
        <ChallengeDiagramArea diagram={diagram} caption={diagramCaption} />
      )}

      {/* Two pill-shaped buttons */}
      <div className="flex gap-3">
        {options.map((opt, i) => {
          let pillClasses =
            "flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-center transition-all cursor-pointer border ";

          if (!submitted) {
            pillClasses +=
              "border-story-border bg-story-card text-text-secondary hover:border-docker-violet/40 hover:bg-docker-violet/5";
          } else if (i === correctIndex) {
            pillClasses +=
              "border-docker-teal bg-docker-teal/10 text-docker-teal";
          } else if (selected === i) {
            pillClasses += "border-docker-red bg-docker-red/10 text-docker-red";
          } else {
            pillClasses +=
              "border-story-border bg-story-card text-text-muted opacity-50";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              className={pillClasses}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Hint toggle */}
      {hint && !submitted && (
        <div>
          <button
            onClick={() => setShowHint((h) => !h)}
            className="text-docker-amber text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          {showHint && (
            <div className="mt-2 text-xs text-docker-amber/80 bg-docker-amber/5 border border-docker-amber/20 rounded-lg px-3 py-2">
              {hint}
            </div>
          )}
        </div>
      )}

      {/* Explanation + Try Again */}
      {submitted && (
        <div
          className={`text-xs rounded-lg px-3 py-2 border ${
            isCorrect
              ? "bg-docker-teal/5 border-docker-teal/20 text-docker-teal"
              : "bg-docker-red/5 border-docker-red/20 text-docker-red"
          }`}
        >
          <p>{explanation}</p>
          {!isCorrect && (
            <button
              onClick={handleTryAgain}
              className="mt-2 text-xs font-semibold text-docker-violet hover:underline cursor-pointer"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
