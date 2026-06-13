import { Star } from "lucide-react";

export default function Footer() {
    return (
        <footer className=" py-6 mt-8 border-t border-border">
            <div className=" container mx-auto text-center text-muted-foreground">
                <span className=" flex items-center justify-center">
                    Criado com 5
                    <Star className="h-8 w-8 fill-accent text-accent-foreground" />
                    por JcSL Informatica
                </span>
            </div>
        </footer>
    );
}