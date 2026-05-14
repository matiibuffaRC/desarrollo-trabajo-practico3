import React from 'react';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <>
            {/* OVERLAY MOBILE */}
            <div
                onClick={() => setIsMenuOpen(false)}
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 md:hidden ${
                    isMenuOpen
                        ? 'opacity-100 visible'
                        : 'opacity-0 invisible'
                }`}
            />

            {/* SIDEBAR MOBILE */}
            <aside
                className={`fixed left-0 top-0 z-50 h-screen w-[280px] border-r border-zinc-800 bg-[#181818] p-6 transition-transform duration-300 md:hidden ${
                    isMenuOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                }`}
            >
                <div className="mb-10 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-[#1DB954]">
                        Soundify
                    </h2>

                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-xl bg-zinc-800 p-2 text-white"
                    >
                        ✕
                    </button>
                </div>

                <nav>
                    <ul className="flex flex-col gap-3 text-base font-medium">
                        <li>
                            <a
                                href="#"
                                className="block rounded-xl bg-[#1DB954] px-4 py-3 text-black"
                            >
                                Inicio
                            </a>
                        </li>

                        <li>
                            <a
                                href="#"
                                className="block rounded-xl px-4 py-3 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                            >
                                Explorar
                            </a>
                        </li>

                        <li>
                            <a
                                href="#"
                                className="block rounded-xl px-4 py-3 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                            >
                                Tendencias
                            </a>
                        </li>

                        <li>
                            <a
                                href="#"
                                className="block rounded-xl px-4 py-3 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                            >
                                Biblioteca
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* HEADER */}
            <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#121212]/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                        {/* MENU BUTTON MOBILE */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="flex items-center justify-center rounded-xl bg-[#181818] p-3 text-white md:hidden"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                                />
                            </svg>
                        </button>

                        {/* LOGO */}
                        <h1 className="text-2xl font-black tracking-tight text-[#1DB954]">
                            Soundify
                        </h1>
                    </div>

                    {/* NAV DESKTOP */}
                    <nav className="hidden md:block">
                        <ul className="flex items-center gap-2 rounded-2xl bg-[#181818] p-2">
                            <li>
                                <a
                                    href="#"
                                    className="rounded-xl bg-[#1DB954] px-5 py-3 text-sm font-semibold text-black"
                                >
                                    Inicio
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#"
                                    className="rounded-xl px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                                >
                                    Explorar
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#"
                                    className="rounded-xl px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                                >
                                    Tendencias
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#"
                                    className="rounded-xl px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                                >
                                    Biblioteca
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}

export default Header;