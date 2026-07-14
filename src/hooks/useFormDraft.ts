'use client'

import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseFormDraftOptions {
    enabled?: boolean;
    clearOnMount?: boolean;
}

export function useFormDraft<T extends Record<string, any>>(
    key: string,
    initialState: T,
    options?: UseFormDraftOptions
) {
    const enabled = options?.enabled ?? true;
    const clearOnMount = options?.clearOnMount ?? false;
    const storageKey = useMemo(() => `appgpp:draft:${key}`, [key]);
    const [state, setState] = useState<T>(initialState);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setState(initialState);
        if (!enabled || typeof window === 'undefined') {
            setHydrated(true);
            return;
        }

        try {
            if (clearOnMount) {
                window.localStorage.removeItem(storageKey);
            }

            const raw = window.localStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    setState((prev) => ({ ...prev, ...parsed }));
                }
            }
        } catch (error) {
            console.error('Erro ao restaurar rascunho do formulario:', error);
        } finally {
            setHydrated(true);
        }
    }, [clearOnMount, enabled, initialState, storageKey]);

    useEffect(() => {
        if (!enabled || !hydrated || typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
            console.error('Erro ao salvar rascunho do formulario:', error);
        }
    }, [enabled, hydrated, state, storageKey]);

    const clearDraft = useCallback(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(storageKey);
    }, [storageKey]);

    return {
        state,
        setState,
        clearDraft,
        hydrated,
    };
}
