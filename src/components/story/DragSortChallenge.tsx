"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import confetti from "canvas-confetti";
import { useProgressStore } from "@/store/progressStore";
import ChallengeDiagramArea from "./ChallengeDiagramArea";

interface SortItem {
  id: string;
  label: string;
  detail?: string;
}

interface DragSortChallengeProps {
  id: string;
  prompt: string;
  items: SortItem[];
  correctOrder: string[];
  hint?: string;
  diagram?: ReactNode;
  diagramCaption?: string;
}

/* ---- Sortable Item sub-component ---- */
interface SortableItemProps {
  item: SortItem;
  status: "idle" | "correct" | "wrong";
}

function SortableItem({ item, status }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  let borderColor = "border-story-border";
  let bgColor = "bg-story-card";
  let indicator: ReactNode = null;

  if (status === "correct") {
    borderColor = "border-docker-teal";
    bgColor = "bg-docker-teal/5";
    indicator = (
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
    );
  } else if (status === "wrong") {
    borderColor = "border-docker-red";
    bgColor = "bg-docker-red/5";
    indicator = (
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
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${borderColor} ${bgColor} transition-colors`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 text-text-muted hover:text-docker-violet cursor-grab active:cursor-grabbing touch-none"
        aria-label={`Drag ${item.label}`}
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </button>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <div className="text-text-primary text-sm font-medium">
          {item.label}
        </div>
        {item.detail && (
          <div className="text-text-muted text-xs mt-0.5">{item.detail}</div>
        )}
      </div>

      {/* Status indicator */}
      {indicator}
    </div>
  );
}

/* ---- Fisher-Yates shuffle ---- */
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ---- Main component ---- */
export default function DragSortChallenge({
  id,
  prompt,
  items,
  correctOrder,
  hint,
  diagram,
  diagramCaption,
}: DragSortChallengeProps) {
  const { markComplete, recordAttempt, resetChallenge, isComplete } =
    useProgressStore();

  const completed = isComplete(id);
  const [order, setOrder] = useState<SortItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  /* Shuffle on mount */
  useEffect(() => {
    setOrder(shuffle(items));
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    if (submitted) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrder((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleCheck = () => {
    recordAttempt(id);
    setSubmitted(true);
    const correct = order.every((item, i) => item.id === correctOrder[i]);
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
    setOrder(shuffle(items));
    setSubmitted(false);
    setAllCorrect(false);
    setShowHint(false);
  };

  const getItemStatus = (
    item: SortItem,
    index: number
  ): "idle" | "correct" | "wrong" => {
    if (!submitted) return "idle";
    return item.id === correctOrder[index] ? "correct" : "wrong";
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
        <p className="text-text-secondary text-sm mt-2">{prompt}</p>
      </div>
    );
  }

  /* ---- Active state ---- */
  return (
    <div className="rounded-xl border border-docker-violet/20 bg-docker-violet/5 p-5 space-y-4">
      {/* Prompt */}
      <p className="text-text-primary font-semibold text-sm">{prompt}</p>

      {/* Diagram */}
      {diagram && (
        <ChallengeDiagramArea diagram={diagram} caption={diagramCaption} />
      )}

      {/* Sortable list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={order.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {order.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                status={getItemStatus(item, index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
          disabled={order.length === 0}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer
            bg-docker-violet text-white hover:bg-docker-violet/90
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check Order
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
