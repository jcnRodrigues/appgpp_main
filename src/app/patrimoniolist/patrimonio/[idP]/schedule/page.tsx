"use client"


import Header from "@/back-end/components/Header/Header";
import AlertaDialogo from "@/back-end/components/AlertDialog/AlertaDialogo";
import { Badge } from "@/back-end/components/ui/badge";
import { Calendar } from "@/back-end/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const genereteTimeSlots = (
    startHour: number,
    endHour: number,
    intervalMinute: number
): string[] => {
    const Slots: string[] = [];
    const startDate = new Date();
    startDate.setHours(startHour, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(endHour, 0, 0, 0);
    while (startDate < endDate) {
        Slots.push(format(startDate, 'HH:mm'));
        startDate.setMinutes(startDate.getMinutes() + intervalMinute);

    }
    return Slots;
}

interface SchedulePageProps {
    params: {
        idP: string;
    }
}

export default function SchedulePage({ params }: SchedulePageProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    function handleDateSelect(date: Date | null) {
        setSelectedDate(date);
        setSelectedTime(null);
    }

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    }

    const handleScheduloClick = () => {
        if (selectedDate && selectedTime) {
            setIsAlertOpen(true);
        }
    }
    const timeSlots = genereteTimeSlots(9, 18, 30);
    return (
        <div>
            <Header />
            <div className="flex items-center mb-6 mt-4">
                <Link href="/" className="mr-4">
                    <ChevronLeft className="h-6 w-6 text-primary" />
                </Link>
                <h6 className="text-h6 text-center flex-grow">Patrimonio data</h6>
                <div className="w-6"></div>
            </div>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-auto mb-6 flex justify-center md:justify-center md:pr-8">
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
                            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
                                <h3 className=" font-semibold mb-3 text-primary text-center">
                                    Patrimonio hora
                                </h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map((slot) => (
                                        <Badge
                                            key={slot}
                                            onClick={() => handleTimeSelect(slot)}
                                            className={cn(
                                                "cursor-pointer justify-center py-2 text-sm font-medium rounded-md border transition-colors",
                                                selectedTime === slot
                                                    ? "bg-accent text-white border-accent hover:bg-accent/90"
                                                    : "bg-transparent text-accent border-accent hover:bg-accent/10"
                                            )}>
                                            {slot}
                                        </Badge>
                                    ))}

                                </div>
                            </div>
                        )}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <h3 className=" font-semibold mb-3 text-primary text-center">
                                Patrimonio hora
                            </h3>
                            <p className="text-sm">
                                Data: 21 de julho de 2025
                            </p>
                            <p className="text-sm">
                                Hora: 11:30
                            </p>
                            <button onClick={handleScheduloClick}
                                className="mt-2 bg-accent w-full text-white p-2 rounded-full">
                                agendar PatrimÃ´nio
                            </button>
                        </div>
                        <AlertaDialogo
                            open={isAlertOpen}
                            onOpenChange={setIsAlertOpen}
                            type="aviso"
                            title="PatrimÃ´nio"
                            message="teste de Patrimonio"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

