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
  compact?: boolean;
};

export default function PageHeader({
  icon: Icon,
  title,
  description,
  actions,
  backHref,
  backLabel = "Voltar",
  className = "",
  iconClassName = "",
  compact = false
}: PageHeaderProps) {
  const headerPadding = compact ? 'px-4 py-3 sm:px-5' : 'px-5 py-4 sm:px-6';
  const headerGap = compact ? 'gap-4 lg:gap-5' : 'gap-5 lg:gap-6';
  const contentGap = compact ? 'gap-3 lg:gap-4' : 'gap-3 lg:gap-4';
  const backSize = compact ? 'h-9 w-9' : 'h-11 w-11';
  const iconSize = compact ? 'h-12 w-12 rounded-xl' : 'h-14 w-14 rounded-2xl';
  const titleSize = compact ? 'text-xl sm:text-2xl' : 'text-[1.55rem]';
  const descSize = compact ? 'text-xs sm:text-sm' : 'text-sm';

  return (
    <div
      className={`form-title-sticky mb-6 mt-4 flex flex-col rounded-2xl border border-border/60 bg-[#10191b] shadow-[0_20px_60px_rgba(0,0,0,0.22)] lg:flex-row lg:items-center lg:justify-between ${headerGap} ${headerPadding} ${className}`}
    >
      <div className={`flex min-w-0 items-center ${contentGap} lg:flex-1`}>
        {backHref ? (
          <Link
            href={backHref}
            className={`inline-flex ${backSize} shrink-0 items-center justify-center rounded-full border border-border/60 bg-[#0d1416] text-slate-100 transition hover:bg-slate-800`}
            aria-label={backLabel}
          >
            <ChevronLeft className={compact ? 'h-4 w-4' : 'h-9 w-9'} />
          </Link>
        ) : null}
        <div
          className={`flex ${iconSize} 
          shrink-0 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 text-white shadow-lg shadow-emerald-950/20 
          ${iconClassName}`}
        >
          <Icon className={compact ? 'h-6 w-6' : 'h-7 w-7'} />
        </div>
        <div className={`min-w-0 ${compact ? 'space-y-0.5' : 'space-y-0.5'}`}>
          <h1 className={`${titleSize} font-semibold tracking-tight text-slate-50 leading-tight`}>{title}</h1>
          {description ? <p className={`max-w-3xl text-slate-300 ${descSize}`}>{description}</p> : null}
        </div>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 lg:ml-auto lg:justify-end lg:pr-2">{actions}</div>
      ) : null}
    </div>
  );
}
