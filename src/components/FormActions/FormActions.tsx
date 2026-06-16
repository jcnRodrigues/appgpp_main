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
    className = 'flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end',
    cancelClassName = 'border-slate-300 bg-slate-950 text-slate-100 shadow-sm hover:bg-slate-900 hover:text-white',
    submitClassName = 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500'
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
                className={`${submitClassName} min-w-[140px]`}
            >
                {loading ? loadingLabel : submitLabel}
            </Button>
        </div>
    );
}
