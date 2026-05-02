import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../types';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ItemCardProps {
  item: GalleryItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundMode, setSoundMode] = useState('Стандарт');

  const soundModes = ['Стандарт', 'В зал', 'Телефон', 'Кино', 'Консерт'];

  return (
    <div
      className="relative h-28 min-w-[180px] cursor-pointer transition-all duration-200 md:h-36 md:min-w-[240px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.type === 'video' ? (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center rounded-sm">
           <Play className="h-10 w-10 text-white opacity-50" />
           <span className="absolute bottom-1 right-1 text-[10px] bg-black/50 px-1 rounded text-white">Видео</span>
        </div>
      ) : (
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-full w-full rounded-sm object-cover"
          referrerPolicy="no-referrer"
        />
      )}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-[25%] left-0 z-10 w-full min-w-[260px] overflow-hidden rounded-md bg-[#181818] shadow-2xl"
          >
            <div 
              className="h-36 w-full relative bg-black cursor-pointer group/video"
              onClick={(e) => {
                const video = e.currentTarget.querySelector('video');
                if (video) {
                  if (video.paused) {
                    video.play();
                    setIsPlaying(true);
                  } else {
                    video.pause();
                    setIsPlaying(false);
                  }
                }
              }}
            >
              {item.type === 'video' ? (
                <>
                  <video 
                    src={item.fileUrl} 
                    className="h-full w-full object-cover" 
                    autoPlay 
                    muted 
                    loop
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/video:opacity-100 transition-opacity">
                    {isPlaying ? (
                      <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <div className="h-6 w-1 bg-white mx-0.5 inline-block" />
                        <div className="h-6 w-1 bg-white mx-0.5 inline-block" />
                      </div>
                    ) : (
                      <Play className="h-8 w-8 text-white fill-current" />
                    )}
                  </div>
                </>
              ) : (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-gray-200">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 text-white hover:border-white">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 text-white hover:border-white">
                    <ThumbsUp className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 text-white hover:border-white">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-green-500">{item.rating} Мувофиқат</span>
                <span className="text-gray-400 border border-gray-400 px-1 rounded-xs">13+</span>
                <span className="text-gray-400">{item.duration}</span>
                <span className="text-gray-400 border border-gray-400 px-1 rounded-sm text-[10px]">HD</span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-white">
                <span>{item.category}</span>
                <span className="h-1 w-1 rounded-full bg-gray-500" />
                <span>{item.year}</span>
              </div>

              {item.type === 'video' && (
                <div className="pt-2 border-t border-gray-800">
                  <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">Намуди садо:</p>
                  <div className="flex flex-wrap gap-1">
                    {soundModes.map((mode) => (
                      <button
                        key={mode}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSoundMode(mode);
                        }}
                        className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${
                          soundMode === mode 
                            ? 'bg-white text-black border-white' 
                            : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
