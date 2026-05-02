import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import FullScreenModal from './components/FullScreenModal';
import { CATEGORIES } from './data';
import { useState, useEffect } from 'react';
import { GalleryItem } from './types';

export default function App() {
  const [userItems, setUserItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentSoundMode, setCurrentSoundMode] = useState('Стандарт');

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

  const handleFilesSelected = (files: FileList) => {
    const newItems: GalleryItem[] = Array.from(files).map((file, index) => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');
      
      return {
        id: `user-${Date.now()}-${index}`,
        title: file.name,
        description: `Файли шахсии шумо: ${file.name}`,
        thumbnail: isVideo ? '' : url,
        fileUrl: url,
        category: 'Боргузориҳо',
        rating: '100%',
        duration: isVideo ? 'Видео' : 'Акс',
        year: '2024',
        type: isVideo ? 'video' : 'image',
        isNew: true
      };
    });

    setUserItems(prev => [...newItems, ...prev]);
  };

  const handleItemClick = (item: GalleryItem, soundMode: string) => {
    setSelectedItem(item);
    setCurrentSoundMode(soundMode);
  };

  return (
    <div className="relative min-h-screen bg-[#141414] overflow-x-hidden font-sans selection:bg-[#E50914] selection:text-white">
      <Navbar onFilesSelected={handleFilesSelected} />
      
      <main className="relative pb-24">
        <Hero onPlayClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()} />
        
        <section className="space-y-8 md:space-y-12 -mt-16 md:-mt-24 lg:-mt-32 relative z-20">
          {userItems.length > 0 && (
            <Row 
              title="Галереяи шумо" 
              items={userItems} 
              onItemClick={handleItemClick}
            />
          )}

          {CATEGORIES.map((category) => (
            <Row 
              key={category.id} 
              title={category.name} 
              items={category.items} 
              onItemClick={handleItemClick}
            />
          ))}

          {userItems.length === 0 && (
            <div className="px-4 md:px-12 py-10">
              <div className="bg-[#181818] p-8 md:p-12 rounded-lg text-center border border-gray-800 backdrop-blur-sm bg-opacity-80">
                <h2 className="text-xl md:text-3xl font-bold text-white mb-4">Галереяи Шумо Холӣ Аст</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-6 text-sm">
                  Барои боргузории видеоҳои шахсӣ тугмаи "Боргузорӣ"-ро пахш кунед.
                </p>
                <button 
                  onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                  className="bg-[#E50914] text-white px-6 py-2 rounded font-bold hover:bg-[#b00710] transition-all"
                >
                  Илова кардани файл
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <FullScreenModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        soundMode={currentSoundMode}
      />

      <footer className="bg-[#141414] px-4 py-12 text-gray-500 md:px-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex gap-6">
             <span className="cursor-pointer hover:underline">Маълумот дар бораи мо</span>
             <span className="cursor-pointer hover:underline">Маркази ёрирасон</span>
             <span className="cursor-pointer hover:underline">Шартҳои истифода</span>
             <span className="cursor-pointer hover:underline">Махфият</span>
          </div>
          <p className="text-xs">&copy; 2024 Галереяи Нав. Ҳамаи ҳуқуқҳо ҳифз шудаанд.</p>
        </div>
      </footer>
    </div>
  );
}
