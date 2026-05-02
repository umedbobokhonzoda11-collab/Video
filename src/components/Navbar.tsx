import { Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  onFilesSelected?: (files: FileList) => void;
}

export default function Navbar({ onFilesSelected }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFilesSelected) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <nav 
      className={`fixed top-0 z-50 w-full px-4 py-4 transition-colors duration-300 md:px-12 ${
        isScrolled ? 'bg-[#141414]' : 'bg-transparent bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple 
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div 
        className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isScrolled ? '' : 'bg-black/20'}`}
      >
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold tracking-tighter text-[#E50914] md:text-3xl">
            NAV GALLERY
          </h1>
        </div>

        <div className="flex items-center gap-5 text-white">
          <Menu 
            className="h-8 w-8 cursor-pointer hover:scale-110 transition-transform" 
            onClick={handleMenuClick}
          />
        </div>
      </div>
    </nav>
  );
}
