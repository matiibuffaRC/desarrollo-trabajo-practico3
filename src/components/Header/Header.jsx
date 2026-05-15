import { useState } from 'react';

import MobileOverlay from './MobileOverlay';
import MobileSidebar from './MobileSidebar';
import DesktopNav from './DesktopNav';
import MobileMenuButton from './MobileMenuButton';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <MobileOverlay
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
            />

            <MobileSidebar
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
            />

            <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#121212]/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                        <MobileMenuButton
                            setIsMenuOpen={setIsMenuOpen}
                        />

                        <h1 className="text-2xl font-black tracking-tight text-[#1DB954]">
                            Soundify
                        </h1>
                    </div>

                    <DesktopNav />
                </div>
            </header>
        </>
    );
}

export default Header;