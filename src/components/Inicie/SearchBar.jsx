import { useState } from 'react' 

function SearchBar({ onSearch }) {
    const [inputValue, setInputValue] = useState('')

    const handleButtonClick = () => {
        if (inputValue.trim()) {
            onSearch(inputValue)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            onSearch(inputValue)
        }
    }

    return (
        <div className="mb-10">
            <div className="relative w-full max-w-xl m-auto">
                <input
                    type="text"
                    placeholder="Buscar artistas..."
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown} 
                    className="w-full rounded-full border border-zinc-800 bg-[#181818] px-6 py-4 pr-14 text-sm outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-[#1DB954] focus:ring-4 focus:ring-[#1DB954]/20 sm:text-base"
                />

                <button 
                    onClick={handleButtonClick}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#1DB954] p-3 text-black transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
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
                            path="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6 16.5a7.5 7.5 0 0 0 10.65 0Z"
                            d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6 16.5a7.5 7.5 0 0 0 10.65 0Z" 
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default SearchBar