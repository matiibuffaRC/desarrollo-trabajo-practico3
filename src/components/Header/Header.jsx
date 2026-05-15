import { useState } from 'react';

import MobileOverlay from './MobileOverlay';
import MobileSidebar from './MobileSidebar';
import DesktopNav from './DesktopNav';
import MobileMenuButton from './MobileMenuButton';
import ArtistsFavList from './ArtistsFavList';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isArtistsFavListOpen, setIsArtistsFavListOpen] = useState(false);

    const favoriteArtists = [
        {
            id: 1,
            name: 'The Weeknd',
            genre: 'R&B',
            image:
                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400',
        },
        {
            id: 2,
            name: 'Drake',
            genre: 'Hip Hop',
            image:
                'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400',
        },
        {
            id: 3,
            name: 'Dua Lipa',
            genre: 'Pop',
            image:
                'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400',
        },
        {
            id: 4,
            name: 'Travis Scott',
            genre: 'Trap',
            image:
                'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=400',
        },
    ];

    return (
        <>
            <MobileOverlay
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                setIsArtistsFavListOpen={setIsArtistsFavListOpen}
            />

            <MobileSidebar
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                setIsArtistsFavListOpen={setIsArtistsFavListOpen}
            />

            <ArtistsFavList
                isArtistsFavListOpen={isArtistsFavListOpen}
                setIsArtistsFavListOpen={setIsArtistsFavListOpen}
                favoriteArtists={favoriteArtists}
            />
            <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#121212]/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-3">
                        <MobileMenuButton
                            setIsMenuOpen={setIsMenuOpen}
                        />

                        <h1 className="text-2xl font-black tracking-tight text-[#1DB954]">
                            Soundify
                        </h1>
                    </div>

                    <DesktopNav
                        setIsArtistsFavListOpen={setIsArtistsFavListOpen}
                    />
                </div>
            </header>
        </>
    )
}

export default Header;