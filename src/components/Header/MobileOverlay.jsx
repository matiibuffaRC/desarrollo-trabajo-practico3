// MobileOverlay.jsx
import { useState } from 'react';

function MobileOverlay({ isMenuOpen, setIsMenuOpen }) {
    return (
        <div
            onClick={() => setIsMenuOpen(false)}
            className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 md:hidden ${
                isMenuOpen
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible'
            }`}
        />
    );
}

export default MobileOverlay;