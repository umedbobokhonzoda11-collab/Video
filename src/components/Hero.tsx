import { Play, Info } from 'lucide-react';
import { FEATURED_ITEM } from '../data';

interface HeroProps {
  onPlayClick?: () => void;
}

export default function Hero({ onPlayClick }: HeroProps) {
  return (
    <div className="relative h-[80vh] w-full md:h-[95vh]">
      <div className="absolute inset-0">
        <img
          src={FEATURED_ITEM.thumbnail}
          alt={FEATURED_ITEM.title}
          className="h-full w-full object-cover brightness-[0.7]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-[15%] left-4 space-y-4 md:left-12 md:max-w-2xl">
        {FEATURED_ITEM.isNew && (
          <div className="flex items-center gap-2">
            <div className="bg-[#E50914] px-2 py-0.5 text-xs font-bold text-white uppercase rounded">
              Нав
            </div>
          </div>
        )}
        <h1 className="text-4xl font-black text-white md:text-7xl drop-shadow-lg">
          {FEATURED_ITEM.title}
        </h1>
        <p className="text-sm font-medium text-gray-200 md:text-lg drop-shadow-md">
          {FEATURED_ITEM.description}
        </p>

        <div className="flex items-center gap-3">
          <button 
            style={{ backgroundColor: '#ffffff' }}
            onClick={onPlayClick}
            className="flex items-center gap-2 rounded px-5 py-2 text-lg font-bold text-black transition hover:opacity-80 md:px-8 md:py-3"
          >
            <Play className="h-6 w-6 fill-current" />
            Намоиш
          </button>
          <button 
            style={{ backgroundColor: '#816a6a' }}
            className="flex items-center gap-2 rounded px-5 py-2 text-lg font-bold text-white transition hover:opacity-80 md:px-8 md:py-3"
          >
            <Info className="h-6 w-6" />
            Маълумот
          </button>
        </div>
      </div>
    </div>
  );
}
