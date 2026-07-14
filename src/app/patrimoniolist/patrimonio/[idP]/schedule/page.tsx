"use client";

import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import AlertaDialogo from '@/components/AlertDialog/AlertaDialogo';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { hasModuleAccess } from '@/lib/permissions';

const genereteTimeSlots = (startHour: number, endHour: number, intervalMinute: number): string[] => {
    const slots: string[] = [];
    const startDate = new Date();
    startDate.setHours(startHour, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(endHour, 0, 0, 0);

    while (startDate < endDate) {
        slots.push(format(startDate, 'HH:mm'));
        startDate.setMinutes(startDate.getMinutes() + intervalMinute);
    }

    return slots;
};

export default function SchedulePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session?.user) {
            router.replace('/');
            return;
        }

        const formularios = ((session.user as any)?.formularios || []) as string[];
        if (!hasModuleAccess(formularios, 'PATRIMONIO')) {
            router.replace('/acesso-negado');
        }
    }, [router, session, status]);

    function handleDateSelect(date: Date | null) {
        setSelectedDate(date);
        setSelectedTime(null);
    }

    const handleScheduloClick = () => {
        if (selectedDate && selectedTime) {
            setIsAlertOpen(true);
        }
    };

    const timeSlots = genereteTimeSlots(9, 18, 30);

    return (
        <div>
            <Header />
            <div className="mx-auto max-w-[86.4rem] px-4">
                <PageHeader
                    icon={CalendarDays}
                    title="Patrimônio data"
                    description="Escolha uma data e um horário para agendar o patrimônio"
                    backHref="/patrimoniolist"
                />
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row">
                        <div className="mb-6 flex justify-center md:pr-8 md:w-auto">
                            <Calendar
                                mode="single"
                                required={true}
                                selected={selectedDate ?? undefined}
                                onSelect={handleDateSelect}
                                locale={ptBR}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                        </div>
                        <div className="flex-1">
                            {selectedDate && (
                                <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                                    <h3 className="mb-3 text-center font-semibold text-primary">Horários do patrimônio</h3>
                                    <div className="grid grid-cols-4 gap-2">
                                        {timeSlots.map((slot) => (
                                            <Badge
                                                key={slot}
                                                onClick={() => setSelectedTime(slot)}
                                                className={cn(
                                                    'cursor-pointer justify-center rounded-md border py-2 text-sm font-medium transition-colors',
                                                    selectedTime === slot
                                                        ? 'border-accent bg-accent text-white hover:bg-accent/90'
                                                        : 'border-accent bg-transparent text-accent hover:bg-accent/10'
                                                )}
                                            >
                                                {slot}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                                <h3 className="mb-3 text-center font-semibold text-primary">Resumo do agendamento</h3>
                                <p className="text-sm">Data: {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : '-'}</p>
                                <p className="text-sm">Hora: {selectedTime || '-'}</p>
                                <button
                                    onClick={handleScheduloClick}
                                    className="mt-2 w-full rounded-full bg-accent p-2 text-white"
                                >
                                    Agendar Patrimônio
                                </button>
                            </div>
                            <AlertaDialogo
                                open={isAlertOpen}
                                onOpenChange={setIsAlertOpen}
                                type="aviso"
                                title="Patrimônio"
                                message="Teste de patrimônio"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
