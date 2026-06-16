import { Star } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-8 border-t border-border py-6">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <span className="inline-flex items-center justify-center gap-2">
                    Criado com
                    <Star className="h-4 w-4 fill-accent text-accent-foreground" />
                    por JcSL Informática
                </span>
            </div>
        </footer>
    );
}
