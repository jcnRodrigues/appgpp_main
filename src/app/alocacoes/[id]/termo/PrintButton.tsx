"use client"

import React from 'react';

export default function PrintButton() {
    return (
        <div className="mt-6">
            <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-95"
            >
                Imprimir
            </button>
        </div>
    );
}
