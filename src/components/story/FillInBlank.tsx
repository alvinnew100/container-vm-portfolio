"use client";

import { useState, useCallback, useRef, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { useProgressStore } from "@/store/progressStore";
import ChallengeDiagramArea from "./ChallengeDiagramArea";

interface BlankDef {
  answer: string;
  placeholder?: string;
  unit?: string;
  tolerance?: number;
}

interface FillInBlankProps {
  id: string;
  prompt: string;
  blanks: BlankDef[];
  explanation?: string;
  hint?: string;
  diagram?: ReactNode;
  diagramCaption?: string;
}

function checkAnswer(input: string, blank: BlankDef): boolean {
  const trimmed = input.trim().toLowerCase();
  const answer = blank.answer.trim().toLowerCase();

  if (blank.tolerance !== undefined) {
    const numInput = parseFloat(trimmed);
    const numAnswer = parseFloat(answer);
    if (isNaN(numInput) || isNaN(numAnswer)) return false;
    return Math.abs(numInput - numAnswer) <= blank.tolerance;
  }

  return trimmed === answer;
}

export default function FillInBlank({
  id,
  prompt,
  blanks,
  explanation,
  hint,
  diagram,
  diagramCaption,
}: FillInBlankProps) {
  const { markComplete, recordAttempt, resetChallenge, isComplete } =
    useProgressStore();

  const completed = isComplete(id);
  const [values, setValues] = useState<string[]>(blanks.map(() => ""));
  const [submitted, setSubmitted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleChange = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    setValues(next);
  };

  const handleCheck = () => {
    recordAttempt(id);
    const correct = blanks.every((blank, i) => checkAnswer(values[i], blank));
    setSubmitted(true);
    setAllCorrect(correct);

    if (correct) {
      markComplete(id);
      fireConfetti();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setAllCorrect(false);
  };

  const handleReset = () => {
    resetChallenge(id);
    setValues(blanks.map(() => ""));
    setSubmitted(false);
    setAllCorrect(false);
    setShowHint(false);
  };

  /* Build inline prompt with inputs */
  const renderPrompt = () => {
    const parts = prompt.split("{blank}");
    const elements: ReactNode[] = [];

    parts.forEach((part, i) => {
      elements.push(<span key={`text-${i}`}>{part}</span>);

      if (i < blanks.length) {
        const blank = blanks[i];
        const isRight = submitted && checkAnswer(values[i], blank);
        const isWrong = submitted && !checkAnswer(values[i], blank);

        elements.push(
          <span key={`blank-${i}`} className="inline-flex items-center gap-1 mx-1">
            <input
              type="text"
              value={values[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={blank.placeholder || "..."}
              disabled={submitted && allCorrect}
              className={`inline-block w-28 px-2 py-1 rounded-md border text-sm text-center font-mono transition-all
                ${
                  isRight
                    ? "border-docker-teal bg-docker-teal/10 text-docker-teal"
                    : isWrong
                    ? "border-docker-red bg-docker-red/10 text-docker-red"
                    : "border-story-border bg-story-card text-text-primary focus:border-docker-violet focus:ring-1 focus:ring-docker-violet/30"
                }
              `}
            />
            {blank.unit && (
              <span className="text-text-muted text-xs">{blank.unit}</span>
            )}
          </span>
        );
      }
    });

    return elements;
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
        <div className="text-text-secondary text-sm mt-2 leading-relaxed">
          {renderPrompt()}
        </div>
      </div>
    );
  }

  /* ---- Active state ---- */
  return (
    <div
      ref={containerRef}
      className={`rounded-xl border border-docker-violet/20 bg-docker-violet/5 p-5 space-y-4 ${
        shake ? "animate-[shake_0.5s_ease-in-out]" : ""
      }`}
      style={
        shake
          ? {
              animation: "shake 0.5s ease-in-out",
            }
          : undefined
      }
    >
      {/* Inline shake keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>

      {/* Prompt with inline inputs */}
      <div className="text-text-primary text-sm leading-relaxed font-medium">
        {renderPrompt()}
      </div>

      {/* Diagram */}
      {diagram && (
        <ChallengeDiagramArea diagram={diagram} caption={diagramCaption} />
      )}

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

      {/* Explanation (shown after submit) */}
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
      {!submitted || !allCorrect ? (
        <button
          onClick={submitted ? handleTryAgain : handleCheck}
          disabled={!submitted && values.some((v) => v.trim() === "")}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer
            bg-docker-violet text-white hover:bg-docker-violet/90
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitted ? "Try Again" : "Check Answer"}
        </button>
      ) : null}
    </div>
  );
}
