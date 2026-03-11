/* eslint-disable @next/next/no-img-element */
"use client"

import { ClipboardCheck, Home, LandmarkIcon, LaptopIcon, LogOut, Menu, PackagePlusIcon, User, UserSearchIcon } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";


export default function Header() {

    const [open, setOpen] = useState(false);
    const { data: session, status } = useSession();


    const menuItens = [
        { icon: Home, label: "Home", href: "/" },
        { icon: User, label: "Funcionários", href: "/funcionariosadd" },
        { icon: LaptopIcon, label: "Patrimônio", href: "/patrimoniolist" },
        { icon: LandmarkIcon, label: "Centros de Custo", href: "/ccustos"},
        { icon: ClipboardCheck, label: "Medição por Cetro de Custo", href: "/ccusto/medicao"},
        { icon: UserSearchIcon, label: "Função", href: "/funcoes" },
        { icon: PackagePlusIcon, label: "Alocação de Patrimonios", href: "/alocacoes" }

    ]


    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-h1 font-extrabold selected-none drop-shadow-sm">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl
        shadow bg-[#e6f7f1] text-[#0f5132] font-bold text-lg tracking-tight">
                    <Link href={"/"}>App - GPP</Link>
                </span>
            </h1>
            <div className="bg-white p-3 rounded-full">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button className="flex items-center justify-center">
                            <Menu className="h-6 w-6 text-primary " />
                        </button>
                    </SheetTrigger>
                    <SheetContent className="border-1-accent p-4">
                        <SheetHeader>
                            <SheetTitle className="text-primary text-center">
                                Menu
                            </SheetTitle>
                        </SheetHeader>

                        {status === "authenticated" && session? (
                            <>
                                <div className=" flex items-center gap-4 mt-6 border-b border-border pb-6">
                                    <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0">
                                        <img
                                            src={session.user?.image || ""}
                                            alt={session.user?.name || "User Avatar"}
                                            className="h-full w-full object-cover items-center" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-foreground">{session.user?.name}</span>
                                        <span className="text-sm text-muted-foreground">{session.user?.email}</span>
                                    </div>
                                </div>
                                <div className=" mt6 flex flex-col gap-5">
                                    {menuItens.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-4 text-lg text-primary hover:text-accent transition-colors"
                                        >
                                            <item.icon className="w-6 h-6 text-accent" />
                                            {item.label}
                                        </a>
                                    ))}
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setOpen(false);
                                        }}
                                        className="flex items-center gap-4 text-red-500 hover:text-red-600 transition-colors">
                                        <LogOut className="w-6 h-6 text-red-500" />
                                        Sair
                                    </button>
                                </div>

                            </>
                        ):(
                        <>
                            <Button
                                onClick={() => signIn('google')}
                                className="flex items-center gap-2 w-[90%] justify-center bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20">
                                    <path d="M19.8055 8.0415H19V8H10V12H15.4045C14.7916 14.1276 12.8882 15.7526 10.5 15.7526C7.42616 15.7526 4.94018 13.2667 4.94018 10.1929C4.94018 7.11902 7.42616 4.63297 10.5 4.63297C11.9366 4.63297 13.2262 5.19015 14.1908 6.09523L17.1898 3.09523C15.4123 1.45032 13.0476 0.383789 10.5 0.383789C5.25215 0.383789 1 4.6359 1 9.88374C1 15.1316 5.25215 19.3837 10.5 19.3837C15.2467 19.3837 19.1639 16.0273 19.8382 11.7501C19.9398 10.9256 20 10.0523 19.9944 9.17309C19.9726 8.79159 19.9071 8.41008 19.8055 8.0415Z" fill="#FFC107" />
                                    <path d="M2.42683 5.88798L5.92215 8.47418C6.73156 6.27523 8.46115 4.63297 10.5 4.63297C11.9366 4.63297 13.2262 5.19015 14.1907 6.09523L17.1898 3.09523C15.4123 1.45032 13.0476 0.383789 10.5 0.383789C7.05305 0.383789 4.03306 2.64633 2.42683 5.88798Z" fill="#FF3D00" />
                                    <path d="M10.5 19.3837C13.0005 19.3837 15.2264 18.3599 16.9122 16.7356L13.6494 13.9906C12.7122 14.6787 11.6095 15.0689 10.5 15.0689C8.13156 15.0689 6.10297 13.4805 5.49335 11.2091L2.0658 13.8093C3.68417 17.1245 6.87874 19.3837 10.5 19.3837Z" fill="#4CAF50" />
                                    <path d="M19.8055 8.0415H19V8H10V12H15.4045C15.1097 12.9379 14.5461 13.7837 13.7998 14.4261L13.8002 14.4257L16.9114 17.1115C16.7344 17.2714 19.9999 15.0001 19.9999 10.0001C19.9999 9.36999 19.9359 8.72378 19.8055 8.0415Z" fill="#1976D2" />
                                </svg>
                                Login com email
                            </Button></>    
                        )}

                    </SheetContent>
                </Sheet>
            </div>
        </div >
    );

}
