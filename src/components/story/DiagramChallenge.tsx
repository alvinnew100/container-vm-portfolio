"use client";

import { useState, useCallback, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { useProgressStore } from "@/store/progressStore";
import ChallengeDiagramArea from "./ChallengeDiagramArea";

/* ---- Interaction mode types ---- */

interface MultipleChoiceInteraction {
  mode: "multiple-choice";
  options: { text: string; correct?: boolean; explanation?: string }[];
}

interface FillInBlankInteraction {
  mode: "fill-in-blank";
  answer: string;
  placeholder?: string;
  tolerance?: number;
}

interface LabelIdentificationInteraction {
  mode: "label-identification";
  labels: { id: string; text: string; correct: string }[];
}

type Interaction =
  | MultipleChoiceInteraction
  | FillInBlankInteraction
  | LabelIdentificationInteraction;

/* ---- Props ---- */

interface DiagramChallengeProps {
  id: string;
  question: string;
  diagram: ReactNode;
  diagramCaption?: string;
  hint?: string;
  interaction: Interaction;
  explanation?: string;
}

/* ---- Component ---- */

export default function DiagramChallenge({
  id,
  question,
  diagram,
  diagramCaption,
  hint,
  interaction,
  explanation,
}: DiagramChallengeProps) {
  const { markComplete, recordAttempt, resetChallenge, isComplete } =
    useProgressStore();

  const completed = isComplete(id);

  /* Shared state */
  const [submitted, setSubmitted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  /* Multiple-choice state */
  const [mcSelected, setMcSelected] = useState<number | null>(null);

  /* Fill-in-blank state */
  const [fibValue, setFibValue] = useState("");

  /* Label identification state */
  const [labelValues, setLabelValues] = useState<Record<string, string>>({});

  const fireConfetti = useCallback(() => {
    const end = Date.now() + 600;
    const colors = ["#00b8a9", "#2496ED", "#6c5ce7"];
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  /* ---- Check logic per mode ---- */
  const handleCheck = () => {
    recordAttempt(id);
    setSubmitted(true);

    let correct = false;

    if (interaction.mode === "multiple-choice") {
      correct =
        mcSelected !== null &&
        interaction.options[mcSelected]?.correct === true;
    } else if (interaction.mode === "fill-in-blank") {
      const trimmed = fibValue.trim().toLowerCase();
      const answer = interaction.answer.trim().toLowerCase();
      if (interaction.tolerance !== undefined) {
        const numInput = parseFloat(trimmed);
        const numAnswer = parseFloat(answer);
        correct =
          !isNaN(numInput) &&
          !isNaN(numAnswer) &&
          Math.abs(numInput - numAnswer) <= interaction.tolerance;
      } else {
        correct = trimmed === answer;
      }
    } else if (interaction.mode === "label-identification") {
      correct = interaction.labels.every(
        (label) =>
          (labelValues[label.id] || "").trim().toLowerCase() ===
          label.correct.trim().toLowerCase()
      );
    }

    setAllCorrect(correct);
    if (correct) {
      markComplete(id);
      fireConfetti();
    }
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setAllCorrect(false);
  };

  const handleReset = () => {
    resetChallenge(id);
    setMcSelected(null);
    setFibValue("");
    setLabelValues({});
    setSubmitted(false);
    setAllCorrect(false);
    setShowHint(false);
  };

  /* ---- Can submit? ---- */
  const canSubmit = (() => {
    if (interaction.mode === "multiple-choice") return mcSelected !== null;
    if (interaction.mode === "fill-in-blank") return fibValue.trim() !== "";
    if (interaction.mode === "label-identification")
      return interaction.labels.every(
        (l) => (labelValues[l.id] || "").trim() !== ""
      );
    return false;
  })();

  /* ---- Completed state ---- */
  if (completed) {
    return (
      <div className="rounded-xl border border-docker-teal/30 bg-docker-teal/5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-docker-teal"
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
            <span className="text-docker-teal font-semibold text-sm">
              Completed
            </span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-text-muted hover:text-docker-violet transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
        <p className="text-text-secondary text-sm mt-2">{question}</p>
      </div>
    );
  }

  /* ---- Render interaction area ---- */
  const renderInteraction = () => {
    if (interaction.mode === "multiple-choice") {
      return (
        <div className="space-y-2">
          {interaction.options.map((opt, i) => {
            let optClasses =
              "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all cursor-pointer ";

            if (!submitted) {
              optClasses +=
                mcSelected === i
                  ? "border-docker-violet bg-docker-violet/10 text-text-primary"
                  : "border-story-border bg-story-card hover:border-docker-violet/40 text-text-secondary";
            } else if (opt.correct) {
              optClasses +=
                "border-docker-teal bg-docker-teal/10 text-docker-teal";
            } else if (mcSelected === i && !opt.correct) {
              optClasses +=
                "border-docker-red bg-docker-red/10 text-docker-red";
            } else {
              optClasses +=
                "border-story-border bg-story-card text-text-muted opacity-60";
            }

            return (
              <button
                key={i}
                onClick={() => {
                  if (!submitted) setMcSelected(i);
                }}
                disabled={submitted}
                className={optClasses}
              >
                <span className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold mt-0.5">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">
                    {opt.text}
                    {submitted && opt.explanation && (
                      <span className="block text-xs mt-1 text-text-muted font-normal">
                        {opt.explanation}
                      </span>
                    )}
                  </span>
                  {submitted && opt.correct && (
                    <svg
                      className="w-5 h-5 text-docker-teal flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {submitted && mcSelected === i && !opt.correct && (
                    <svg
                      className="w-5 h-5 text-docker-red flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    if (interaction.mode === "fill-in-blank") {
      const isRight =
        submitted &&
        (() => {
          const t = fibValue.trim().toLowerCase();
          const a = interaction.answer.trim().toLowerCase();
          if (interaction.tolerance !== undefined) {
            const nI = parseFloat(t);
            const nA = parseFloat(a);
            return (
              !isNaN(nI) &&
              !isNaN(nA) &&
              Math.abs(nI - nA) <= interaction.tolerance
            );
          }
          return t === a;
        })();
      const isWrong = submitted && !isRight;

      return (
        <div>
          <input
            type="text"
            value={fibValue}
            onChange={(e) => setFibValue(e.target.value)}
            placeholder={interaction.placeholder || "Type your answer..."}
            disabled={submitted && allCorrect}
            className={`w-full px-4 py-3 rounded-lg border text-sm font-mono transition-all
              ${
                isRight
                  ? "border-docker-teal bg-docker-teal/10 text-docker-teal"
                  : isWrong
                  ? "border-docker-red bg-docker-red/10 text-docker-red"
                  : "border-story-border bg-story-card text-text-primary focus:border-docker-violet focus:ring-1 focus:ring-docker-violet/30"
              }
            `}
          />
        </div>
      );
    }

    if (interaction.mode === "label-identification") {
      return (
        <div className="space-y-3">
          {interaction.labels.map((label) => {
            const val = labelValues[label.id] || "";
            const isRight =
              submitted &&
              val.trim().toLowerCase() === label.correct.trim().toLowerCase();
            const isWrong = submitted && !isRight;

            return (
              <div key={label.id} className="flex items-center gap-3">
                <span className="text-text-secondary text-sm font-medium min-w-[100px]">
                  {label.text}
                </span>
                <input
                  type="text"
                  value={val}
                  onChange={(e) =>
                    setLabelValues((prev) => ({
                      ...prev,
                      [label.id]: e.target.value,
                    }))
                  }
                  placeholder="..."
                  disabled={submitted && allCorrect}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-mono transition-all
                    ${
                      isRight
                        ? "border-docker-teal bg-docker-teal/10 text-docker-teal"
                        : isWrong
                        ? "border-docker-red bg-docker-red/10 text-docker-red"
                        : "border-story-border bg-story-card text-text-primary focus:border-docker-violet focus:ring-1 focus:ring-docker-violet/30"
                    }
                  `}
                />
                {isRight && (
                  <svg
                    className="w-4 h-4 text-docker-teal flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {isWrong && (
                  <svg
                    className="w-4 h-4 text-docker-red flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  /* ---- Active state ---- */
  return (
    <div className="rounded-xl border border-docker-violet/20 bg-docker-violet/5 p-5 space-y-4">
      {/* Question */}
      <p className="text-text-primary font-semibold text-sm">{question}</p>

      {/* Diagram */}
      <ChallengeDiagramArea diagram={diagram} caption={diagramCaption} />

      {/* Interaction area */}
      {renderInteraction()}

      {/* Hint toggle */}
      {hint && (
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

      {/* Explanation (shown after submission) */}
      {submitted && explanation && (
        <div
          className={`text-xs rounded-lg px-3 py-2 border ${
            allCorrect
              ? "bg-docker-teal/5 border-docker-teal/20 text-docker-teal"
              : "bg-docker-red/5 border-docker-red/20 text-docker-red"
          }`}
        >
          {explanation}
        </div>
      )}

      {/* Action button */}
      {!submitted ? (
        <button
          onClick={handleCheck}
          disabled={!canSubmit}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer
            bg-docker-violet text-white hover:bg-docker-violet/90
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check Answer
        </button>
      ) : !allCorrect ? (
        <button
          onClick={handleTryAgain}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer
            bg-docker-violet text-white hover:bg-docker-violet/90"
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}
