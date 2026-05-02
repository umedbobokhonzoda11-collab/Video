import { motion } from 'motion/react';
import { Search, Bell, User, Menu, Upload } from 'lucide-react';
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

  const handleUploadClick = () => {
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
        style={{ backgroundColor: '#000000' }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-8">
          <h1 
            style={{ backgroundColor: '#120000' }}
            className="text-2xl font-bold tracking-tighter text-[#E50914] md:text-3xl"
          >
            NAV GALLERY
          </h1>
          
          <ul className="hidden items-center gap-5 text-sm text-gray-200 lg:flex">
            <li className="cursor-pointer font-bold text-white hover:text-gray-300">Асосӣ</li>
            <li className="cursor-pointer hover:text-gray-300">Филмҳо</li>
            <li className="cursor-pointer hover:text-gray-300">Навгониҳо</li>
            <li className="cursor-pointer hover:text-gray-300">Рӯйхати ман</li>
          </ul>
        </div>

        <div className="flex items-center gap-5 text-white">
          <div 
            onClick={handleUploadClick}
            className="flex items-center gap-2 cursor-pointer bg-[#E50914] px-3 py-1.5 rounded-sm hover:bg-[#b00710] transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-bold">Боргузорӣ</span>
          </div>
          <Search className="h-5 w-5 cursor-pointer" />
          <p className="hidden text-sm lg:block">Кӯдакон</p>
          <Bell className="h-5 w-5 cursor-pointer" />
          <div className="flex items-center gap-2 cursor-pointer">
            <User className="h-8 w-8 rounded bg-gray-600 p-1" />
          </div>
          <Menu className="h-6 w-6 cursor-pointer lg:hidden" />
        </div>
      </div>
    </nav>
  );
}
