import React from 'react';

export function Footer() {
    return (
        // Substituí 'bg-background' por 'bg-white'
        <footer className="w-full py-6 bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 text-center">
                {/* Substituí 'text-muted-foreground' por 'text-black' */}
                <p className="text-sm text-black">
                    &copy; {new Date().getFullYear()} Tool-hub. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
}
