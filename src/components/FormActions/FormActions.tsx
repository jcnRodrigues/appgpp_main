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
    className = 'flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end',
    cancelClassName = 'border-red-500/70 bg-red-600 text-white shadow-sm hover:bg-red-500 dark:border-red-400/70 dark:bg-red-500/80',
    submitClassName = 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500'
}: Props) {
    const cancelButton = (
        cancelHref ? (
            <Button asChild type="button" variant="ghost" className={cancelClassName}>
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
                variant="ghost"
                disabled={loading || disabled}
                className={`${submitClassName} min-w-[120px]`}
            >
                {loading ? loadingLabel : submitLabel}
            </Button>
        </div>
    );
}
