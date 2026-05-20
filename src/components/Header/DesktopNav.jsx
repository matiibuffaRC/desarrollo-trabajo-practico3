import { navLinks } from './navLinks';
import { Link } from 'react-router-dom';

function DesktopNav({ setIsArtistsFavListOpen }) {
    return (

<nav className="hidden md:block">
    <ul className="flex items-center gap-1 rounded-2xl p-1">
        {navLinks.map((link, index) => (
            <li key={link.label} className="border border-red-500">
                
                {/* Si es Biblioteca → botón */}
                {link.label === 'Biblioteca' ? (
                    <button
                        onClick={() => setIsArtistsFavListOpen(true)}
                        className={`rounded-full px-5 py-1 text-md transition-colors hover:cursor-pointer ${
                            index === 0
                                ? 'bg-[#1DB954] font-semibold text-black'
                                : 'font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        {link.label}
                    </button>
                ) : (
                    /* El resto → links normales */
                    <Link
                        to={link.path}
                        className={`block rounded-full px-5 py-1 text-md transition-colors ${
                            index === 0
                                ? 'bg-[#1DB954] font-semibold text-black'
                                : 'font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        {link.label}
                    </Link>
                )}

            </li>
        ))}
    </ul>
</nav>
    );
}

export default DesktopNav;