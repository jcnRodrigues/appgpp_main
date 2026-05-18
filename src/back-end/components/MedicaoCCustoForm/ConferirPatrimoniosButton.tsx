'use client';

import { Button } from '@/back-end/components/ui/button';

export default function ConferirPatrimoniosButton({ loading }: { loading: boolean }) {
    return (
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
            {loading ? 'Processando...' : 'Conferir Patrimonios'}
        </Button>
    );
}

