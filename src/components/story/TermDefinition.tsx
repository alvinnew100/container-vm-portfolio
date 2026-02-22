interface TermDefinitionProps {
  term: string;
  definition: string;
}

export default function TermDefinition({
  term,
  definition,
}: TermDefinitionProps) {
  return (
    <span className="inline">
      <span className="font-semibold text-text-primary border-b border-dotted border-docker-blue/40">
        {term}
      </span>
      <span className="text-text-secondary text-sm"> ({definition})</span>
    </span>
  );
}
