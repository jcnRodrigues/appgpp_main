import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

type PageHeaderProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
  iconClassName?: string;
};

export default function PageHeader({
  icon: Icon,
  title,
  description,
  actions,
  backHref,
  backLabel = "Voltar",
  className = "",
  iconClassName = ""
}: PageHeaderProps) {
  return (
    <div className={`form-title-sticky mb-8 mt-4 flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/80 px-4 py-4 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between lg:gap-6 ${className}`}>
      <div className="flex min-w-0 items-center gap-3 lg:flex-1">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex h-10 w-10 items-center 
            justify-center rounded-full border border-border bg-background text-primary transition hover:bg-secondary"
            aria-label={backLabel}
          >
            <ChevronLeft className="h-5 w-5"/>
          </Link>
        ) : null}
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 text-white shadow-md
           ${iconClassName}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 space-y-1">
          <h1 className="text-h2 font-bold leading-tight">
            {title}
          </h1>
          {description ?
            <p className="max-w-3xl text-sm text-muted-foreground">
              {description}
            </p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 lg:ml-auto lg:justify-end lg:pr-2">
        {actions}
      </div>
        : null}
    </div>
  );
}
