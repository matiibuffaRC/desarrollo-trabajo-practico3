// MobileMenuButton.jsx

function MobileMenuButton({ setIsMenuOpen }) {
    return (
        <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center justify-center rounded-2xl bg-[#181818] p-2 text-white transition-colors hover:bg-zinc-800 md:hidden"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                />
            </svg>
        </button>
    );
}

export default MobileMenuButton;