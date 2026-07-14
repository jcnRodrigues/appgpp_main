"use client";

import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CircleHelp,
  TriangleAlert
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

export type AlertaDialogoTipo = 'sucesso' | 'erro' | 'aviso' | 'confirmacao';

type AlertaDialogoProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: AlertaDialogoTipo;
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const DEFAULT_TITLES: Record<AlertaDialogoTipo, string> = {
  sucesso: 'Sucesso',
  erro: 'Erro',
  aviso: 'Atenção',
  confirmacao: 'Confirmação'
};

const ALERT_STYLES: Record<
  AlertaDialogoTipo,
  { icon: React.ElementType; iconClass: string; titleClass: string; actionClass: string }
> = {
  sucesso: {
    icon: CheckCircle2,
    iconClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
    titleClass: 'text-foreground',
    actionClass: 'bg-emerald-600 text-white hover:bg-emerald-600/90'
  },
  erro: {
    icon: AlertCircle,
    iconClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
    titleClass: 'text-foreground',
    actionClass: 'bg-rose-600 text-white hover:bg-rose-600/90'
  },
  aviso: {
    icon: TriangleAlert,
    iconClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    titleClass: 'text-foreground',
    actionClass: 'bg-amber-600 text-white hover:bg-amber-600/90'
  },
  confirmacao: {
    icon: CircleHelp,
    iconClass: 'border border-border bg-background text-foreground',
    titleClass: 'text-foreground',
    actionClass: 'bg-rose-600 text-white hover:bg-rose-500'
  }
};

export default function AlertaDialogo({
  open,
  onOpenChange,
  type = 'aviso',
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}: AlertaDialogoProps) {
  const styles = ALERT_STYLES[type];
  const resolvedTitle = title ?? DEFAULT_TITLES[type];
  const isConfirm = type === 'confirmacao';
  const Icon = styles.icon;

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border border-border bg-card text-foreground shadow-2xl">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className={cn('flex items-center gap-3 text-base font-semibold', styles.titleClass)}>
            <span className={cn('inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold', styles.iconClass)}>
              <Icon className="h-5 w-5" />
            </span>
            {resolvedTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-end">
          {isConfirm ? (
            <>
              <AlertDialogCancel
                onClick={handleCancel}
                className="border border-border bg-background text-foreground hover:bg-secondary hover:text-foreground"
              >
                {cancelText ?? 'Cancelar'}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm} className={cn('px-6 shadow-sm', styles.actionClass)}>
                {confirmText ?? 'Confirmar'}
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction onClick={handleConfirm} className={cn('px-6 shadow-sm', styles.actionClass)}>
              {confirmText ?? 'Ok'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
