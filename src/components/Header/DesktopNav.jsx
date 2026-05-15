// DesktopNav.jsx
import { useState } from 'react';
import { navLinks } from './navLinks';

function DesktopNav() {
    return (
        <nav className="hidden md:block">
            <ul className="flex flex-row items-center  gap-2 rounded-2xl bg-[#181818] p-1.5">
                {navLinks.map((link, index) => (
                    <li key={link.label}>
                        <a
                            href={link.href}
                            className={`rounded-xl px-5 py-1 text-md transition-colors ${
                                index === 0
                                    ? 'bg-[#1DB954] font-semibold text-black'
                                    : 'font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white'
                            }`}
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default DesktopNav;