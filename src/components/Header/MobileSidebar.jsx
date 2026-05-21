import { Link } from 'react-router-dom';
import { navLinks } from './navLinks';

function MobileSidebar({
    isMenuOpen,
    setIsMenuOpen,
    setIsArtistsFavListOpen,
}) {
    return (
        <aside
            className={`fixed left-0 top-0 z-50 h-screen w-70 border-r border-zinc-800 bg-[#181818] p-6 transition-transform duration-300 md:hidden ${
                isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div className="mb-10 flex items-center justify-between">
                <h2 className="text-2xl font-black text-[#1DB954]">
                    SpotifyAPI
                </h2>

                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs text-white cursor-pointer"
                >
                    ✕
                </button>
            </div>

            <nav>
                <ul className="flex flex-col gap-3 text-base font-medium">
                    {navLinks.map((link, index) => (
                        <li key={link.label}>
                            {link.label === 'Biblioteca' ? (
                                <button
                                    onClick={() => {
                                        setIsArtistsFavListOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`block w-full rounded-xl px-4 py-3 text-left transition-colors cursor-pointer ${
                                        index === 0
                                            ? 'bg-[#1DB954] text-black'
                                            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                    }`}
                                >
                                    {link.label}
                                </button>
                            ) : (
                                <Link
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block w-full rounded-xl px-4 py-3 text-left transition-colors ${
                                        index === 0
                                            ? 'bg-[#1DB954] text-black'
                                            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default MobileSidebar;