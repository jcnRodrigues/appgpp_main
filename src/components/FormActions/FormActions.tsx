'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
    cancelHref?: string;
    onCancel?: () => void;
    cancelLabel?: string;
    submitLabel: string;
    loadingLabel?: string;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    cancelClassName?: string;
    submitClassName?: string;
};

export default function FormActions({
    cancelHref,
    onCancel,
    cancelLabel = 'Cancelar',
    submitLabel,
    loadingLabel = 'Salvando...',
    loading = false,
    disabled = false,
    className = 'flex gap-4 justify-end pt-6',
    cancelClassName = 'border-slate-300 bg-slate-950 text-slate-100 hover:bg-slate-900 hover:text-white shadow-sm',
    submitClassName = 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
}: Props) {
    const cancelButton = (
        cancelHref ? (
            <Button asChild type="button" variant="outline" className={cancelClassName}>
                <Link href={cancelHref}>{cancelLabel}</Link>
            </Button>
        ) : (
            <Button
                type="button"
                variant="outline"
                className={cancelClassName}
                onClick={onCancel}
            >
                {cancelLabel}
            </Button>
        )
    );

    return (
        <div className={className}>
            {cancelButton}
            <Button
                type="submit"
                variant="default"
                disabled={loading || disabled}
                className={submitClassName}
            >
                {loading ? loadingLabel : submitLabel}
            </Button>
        </div>
    );
}
