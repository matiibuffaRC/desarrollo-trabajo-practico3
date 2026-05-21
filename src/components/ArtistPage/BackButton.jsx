import React from "react";

function BackButton({ onBack }) {
    return (
        <button
        onClick={onBack}
        className="mb-6 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-2 rounded-full text-sm transition-colors shadow-md cursor-pointer"
        >
        ← Volver al Buscador
        </button>
    );
}

export default BackButton;
