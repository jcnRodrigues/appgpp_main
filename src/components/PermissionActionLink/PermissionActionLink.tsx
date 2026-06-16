'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { hasActionPermission, hasModuleActionPermission, type ActionPermission } from '@/lib/permissions';
import { notify as showNotify } from '@/lib/notify';

type PermissionActionLinkProps = {
  href: string;
  action: ActionPermission;
  module?: string;
  deniedMessage: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
};

export default function PermissionActionLink({
  href,
  action,
  module,
  deniedMessage,
  className,
  title,
  children
}: PermissionActionLinkProps) {
  const { data: session } = useSession();
  const formularios = ((session?.user as any)?.formularios || []) as string[];
  const allowed = module
    ? hasModuleActionPermission(formularios, module, action)
    : hasActionPermission(formularios, action);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (allowed) return;
    e.preventDefault();
    showNotify('aviso', deniedMessage);
  };

  return (
    <Link href={href} onClick={handleClick} className={className} title={title}>
      {children}
    </Link>
  );
}
