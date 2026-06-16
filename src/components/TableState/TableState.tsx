import type { LucideIcon } from 'lucide-react';

type TableStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  compact?: boolean;
};

export default function TableState({ icon: Icon, title, description, compact = false }: TableStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-center text-muted-foreground 
        ${compact ? 'px-4 py-4' : 'px-6 py-8'}`}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-background text-primary shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm font-semibold text-foreground">
        {title}
      </div>
      {description ? <div className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">{description}</div> : null}
    </div>
  );
}
