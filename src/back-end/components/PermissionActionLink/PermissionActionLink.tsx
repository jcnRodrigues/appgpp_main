'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { hasActionPermission, type ActionPermission } from '@/lib/permissions';

type PermissionActionLinkProps = {
  href: string;
  action: ActionPermission;
  deniedMessage: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
};

export default function PermissionActionLink({
  href,
  action,
  deniedMessage,
  className,
  title,
  children
}: PermissionActionLinkProps) {
  const { data: session } = useSession();
  const formularios = ((session?.user as any)?.formularios || []) as string[];
  const allowed = hasActionPermission(formularios, action);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (allowed) return;
    e.preventDefault();
    window.systemAlert?.('aviso', deniedMessage);
  };

  return (
    <Link href={href} onClick={handleClick} className={className} title={title}>
      {children}
    </Link>
  );
}
