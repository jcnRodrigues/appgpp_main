import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  linkHref?: string;
}

export default function SectionHeader({ title, linkText, linkHref }: SectionHeaderProps) {
  return (
    <div className="form-title-sticky mb-4 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      {linkHref && linkText ? (
        <Link href={linkHref} className="text-sm font-medium text-accent transition hover:underline">
          {linkText}
        </Link>
      ) : null}
    </div>
  );
}
