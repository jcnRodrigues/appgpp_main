/* eslint-disable @next/next/no-img-element */
"use client"

import {  Home, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useState } from "react";





export default function Header() {

    const [open, setOpen] = useState(false);

    const userAccont = {
        name: "Joao Claudio Nascimento Rodrigues",
        email: "joao.n.rodrigues@icloud.com",
        avatar: "https://github.com/jcnRodrigues.png"
    }

    const menuItens = [
        { icon: Home, label: "Home", href: "/" },
        { icon: User, label: "Funcionários", href: "/appointments" },
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
                        <div className=" flex items-center gap-4 mt-6 border-b border-border pb-6">
                            <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                    src={userAccont.avatar}
                                    alt="Avatar"
                                    className="h-full w-full object-cover items-center" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-foreground">{userAccont.name}</span>
                                <span className="text-sm text-muted-foreground">{userAccont.email}</span>
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
                            <button className="flex items-center gap-4 text-red-500 hover:text-red-600 transition-colors">
                                   <LogOut className="w-6 h-6 text-red-500" />
                                    Sair
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );

}