"use client";

import { useState, useCallback, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { useProgressStore } from "@/store/progressStore";
import ChallengeDiagramArea from "./ChallengeDiagramArea";

interface QuizOption {
  text: string;
  correct?: boolean;
  explanation?: string;
}

interface QuizCardProps {
  id: string;
  question: string;
  options: QuizOption[];
  hint?: string;
  diagram?: ReactNode;
  diagramCaption?: string;
}

export default function QuizCard({
  id,
  question,
  options,
  hint,
  diagram,
  diagramCaption,
}: QuizCardProps) {
  const { markComplete, recordAttempt, resetChallenge, isComplete } =
    useProgressStore();

  const completed = isComplete(id);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = selected !== null && options[selected]?.correct === true;

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

  const handleCheck = () => {
    if (selected === null) return;
    recordAttempt(id);
    setSubmitted(true);
    if (options[selected]?.correct) {
      markComplete(id);
      fireConfetti();
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

  /* ---- Active state ---- */
  return (
    <div className="rounded-xl border border-docker-violet/20 bg-docker-violet/5 p-5 space-y-4">
      {/* Question */}
      <p className="text-text-primary font-semibold text-sm">{question}</p>

      {/* Diagram */}
      {diagram && (
        <ChallengeDiagramArea diagram={diagram} caption={diagramCaption} />
      )}

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt, i) => {
          let optionClasses =
            "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all cursor-pointer ";

          if (!submitted) {
            optionClasses +=
              selected === i
                ? "border-docker-violet bg-docker-violet/10 text-text-primary"
                : "border-story-border bg-story-card hover:border-docker-violet/40 text-text-secondary";
          } else if (opt.correct) {
            optionClasses +=
              "border-docker-teal bg-docker-teal/10 text-docker-teal";
          } else if (selected === i && !opt.correct) {
            optionClasses +=
              "border-docker-red bg-docker-red/10 text-docker-red";
          } else {
            optionClasses +=
              "border-story-border bg-story-card text-text-muted opacity-60";
          }

          return (
            <button
              key={i}
              onClick={() => {
                if (!submitted) setSelected(i);
              }}
              disabled={submitted}
              className={optionClasses}
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
                {submitted && selected === i && !opt.correct && (
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

      {/* Action button */}
      {!submitted ? (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer
            bg-docker-violet text-white hover:bg-docker-violet/90
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check Answer
        </button>
      ) : !isCorrect ? (
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
