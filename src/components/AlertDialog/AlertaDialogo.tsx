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
    iconClass: 'bg-emerald-100 text-emerald-700',
    titleClass: 'text-emerald-900',
    actionClass: 'bg-emerald-600 text-white hover:bg-emerald-600/90'
  },
  erro: {
    icon: AlertCircle,
    iconClass: 'bg-rose-100 text-rose-700',
    titleClass: 'text-rose-900',
    actionClass: 'bg-rose-600 text-white hover:bg-rose-600/90'
  },
  aviso: {
    icon: TriangleAlert,
    iconClass: 'bg-amber-100 text-amber-700',
    titleClass: 'text-amber-900',
    actionClass: 'bg-amber-600 text-white hover:bg-amber-600/90'
  },
  confirmacao: {
    icon: CircleHelp,
    iconClass: 'border border-rose-500/30 bg-rose-500/10 text-rose-200',
    titleClass: 'text-slate-50',
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
      <AlertDialogContent className="max-w-md border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className={cn('flex items-center gap-3 text-base font-semibold', styles.titleClass)}>
            <span className={cn('inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold', styles.iconClass)}>
              <Icon className="h-5 w-5" />
            </span>
            {resolvedTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-end">
          {isConfirm ? (
            <>
              <AlertDialogCancel
                onClick={handleCancel}
                className="border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 hover:text-slate-50"
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
