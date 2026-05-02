import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { GalleryItem } from '../types';
import { useState, useRef, useEffect } from 'react';

interface FullScreenModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  soundMode: string;
}

export default function FullScreenModal({ item, onClose, soundMode }: FullScreenModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSound, setCurrentSound] = useState(soundMode);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const soundModes = ['Стандарт', 'В зал', 'Телефон', 'Кино', 'Консерт'];

  const toggleSoundMode = () => {
    const currentIndex = soundModes.indexOf(currentSound);
    const nextIndex = (currentIndex + 1) % soundModes.length;
    setCurrentSound(soundModes[nextIndex]);
  };

  useEffect(() => {
    if (item && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay with sound blocked, trying muted...", err);
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, [item]);

  const handleUserInteraction = () => {
    if (!hasInteracted && videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setHasInteracted(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleUserInteraction}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 transition-all"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] rounded-full bg-black/50 p-2 text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-8 w-8" />
        </button>

        <div className="relative h-full w-full max-w-6xl flex flex-col justify-center p-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
            {item.type === 'video' ? (
              <video
                ref={videoRef}
                src={item.fileUrl}
                className="h-full w-full object-contain"
                autoPlay
                loop
                muted={isMuted}
                onClick={togglePlay}
              />
            ) : (
              <img
                src={item.thumbnail || item.fileUrl}
                alt={item.title}
                className="h-full w-full object-contain"
              />
            )}

            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current" />}
                  </button>
                  <button className="text-white hover:scale-110 transition-transform">
                    <RotateCcw className="h-6 w-6" />
                  </button>
                  <div className="flex items-center gap-2 group relative">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:scale-110 transition-transform">
                      {isMuted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
                    </button>
                    <button 
                      onClick={toggleSoundMode}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded text-xs text-white font-bold transition-all"
                    >
                      Садо: {currentSound}
                    </button>
                  </div>
                </div>
                
                <div className="text-center flex-1 px-8">
                  <h2 className="text-xl font-bold text-white truncate">{item.title}</h2>
                </div>

                <div className="flex items-center gap-4">
                   <Maximize className="h-6 w-6 text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4 px-2">
             <div className="flex items-center gap-4 text-sm font-bold">
               <span className="text-green-500">{item.rating} Мувофиқат</span>
               <span className="text-gray-400">{item.year}</span>
               <span className="border border-gray-600 px-2 rounded text-xs text-gray-400 uppercase">{item.duration}</span>
             </div>
             <p className="text-lg text-gray-300 max-w-3xl">
               {item.description}
             </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
