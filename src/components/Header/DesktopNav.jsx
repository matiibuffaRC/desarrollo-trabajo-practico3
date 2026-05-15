import { navLinks } from './navLinks';

function DesktopNav({ setIsArtistsFavListOpen }) {
    return (
        <nav className="hidden md:block">
            <ul className="flex items-center gap-1 rounded-2xl p-1">
                {navLinks.map((link, index) => (
                    <li key={link.label}>
                        <button
                            onClick={() => {
                                if (link.label === 'Biblioteca') {
                                    setIsArtistsFavListOpen(true);
                                }
                            }}
                            className={`rounded-full px-5 py-1 text-md transition-colors hover:cursor-pointer ${
                                index === 0
                                    ? 'bg-[#1DB954] font-semibold text-black'
                                    : 'font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white'
                            }`}
                        >
                            {link.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default DesktopNav;