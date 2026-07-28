"use client";

import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RefreshButton() {
  const router = useRouter();

  return (
    <Button type="button" onClick={() => router.refresh()} className="shadow-sm">
      <RefreshCcw className="h-4 w-4" />
      Recarregar
    </Button>
  );
}
