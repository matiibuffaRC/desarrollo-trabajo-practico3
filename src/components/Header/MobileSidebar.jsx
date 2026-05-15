// MobileSidebar.jsx
import { useState } from 'react';
import { navLinks } from './navLinks';

function MobileSidebar({ isMenuOpen, setIsMenuOpen }) {
    return (
        <aside
            className={`fixed left-0 top-0 z-50 h-screen w-70 border-r border-zinc-800 bg-[#181818] p-4 py-6 transition-transform duration-300 md:hidden ${
                isMenuOpen
                    ? 'translate-x-0'
                    : '-translate-x-full'
            }`}
        >
            <div className="pb-2 mb-6 flex flex-row items-center justify-between border-b border-zinc-700">
                <h2 className="text-2xl font-black text-[#1DB954]">
                    Soundify
                </h2>

                <button onClick={() => setIsMenuOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs text-white font-bold">
                    ✕
                </button>
            </div>

            <nav>
                <ul className="flex flex-col gap-3 text-lg font-medium">
                    {navLinks.map((link, index) => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                className={`block rounded-full px-4 py-1 transition-colors ${
                                    index === 0
                                        ? 'bg-[#1DB954] text-black'
                                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                }`}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default MobileSidebar;