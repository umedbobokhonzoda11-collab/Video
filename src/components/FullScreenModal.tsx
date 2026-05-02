import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';
import { GalleryItem } from '../types';
import { useState, useRef, useEffect } from 'react';

interface FullScreenModalProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
  soundMode: string;
}

export default function FullScreenModal({ items, initialIndex, onClose, soundMode }: FullScreenModalProps) {
  const [currentSound, setCurrentSound] = useState(soundMode);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const soundModes = ['Стандарт', 'В зал', 'Телефон', 'Кино', 'Консерт'];

  useEffect(() => {
    if (initialIndex !== -1 && containerRef.current) {
        const target = containerRef.current.children[initialIndex] as HTMLElement;
        if (target) {
            target.scrollIntoView({ behavior: 'auto' });
            setActiveIndex(initialIndex);
        }
    }
  }, [initialIndex]);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  const toggleSoundMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = soundModes.indexOf(currentSound);
    const nextIndex = (currentIndex + 1) % soundModes.length;
    setCurrentSound(soundModes[nextIndex]);
  };

  if (items.length === 0 || initialIndex === -1) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[120] rounded-full bg-black/50 p-2 text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-8 w-8" />
        </button>

        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, idx) => (
            <VideoCard 
              key={item.id} 
              item={item} 
              isActive={idx === activeIndex} 
              soundMode={currentSound}
              onToggleSound={toggleSoundMode}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface VideoCardProps {
  item: GalleryItem;
  isActive: boolean;
  soundMode: string;
  onToggleSound: (e: React.MouseEvent) => void;
}

function VideoCard({ item, isActive, soundMode, onToggleSound }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Context and Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (videoRef.current && isActive) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        sourceRef.current = audioCtxRef.current.createMediaElementSource(videoRef.current);
        
        // Setup Nodes
        filterNodeRef.current = audioCtxRef.current.createBiquadFilter();
        gainNodeRef.current = audioCtxRef.current.createGain();
        delayNodeRef.current = audioCtxRef.current.createDelay();
        
        // Reverb Simulation (Simple)
        reverbNodeRef.current = audioCtxRef.current.createConvolver();
        
        // Connect initial chain
        sourceRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }
      
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else if (videoRef.current && !isActive) {
      videoRef.current.pause();
    }
  }, [isActive]);

  // Apply Sound Effects based on soundMode
  useEffect(() => {
    if (!audioCtxRef.current || !sourceRef.current || !gainNodeRef.current || !filterNodeRef.current || !delayNodeRef.current) return;

    const ctx = audioCtxRef.current;
    const source = sourceRef.current;
    const gain = gainNodeRef.current;
    const filter = filterNodeRef.current;
    const delay = delayNodeRef.current;

    // Disconnect everything first
    source.disconnect();
    filter.disconnect();
    delay.disconnect();

    if (ctx.state === 'suspended') ctx.resume();

    switch (soundMode) {
      case 'Телефон':
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 1.0;
        source.connect(filter);
        filter.connect(ctx.destination);
        break;
      case 'В зал':
        // Simple Hall Effect using multiple delays or high gain low shelf
        filter.type = 'lowshelf';
        filter.frequency.value = 300;
        filter.gain.value = 10;
        delay.delayTime.value = 0.05;
        source.connect(delay);
        delay.connect(filter);
        filter.connect(ctx.destination);
        break;
      case 'Кино':
        filter.type = 'lowshelf';
        filter.frequency.value = 100;
        filter.gain.value = 15;
        source.connect(filter);
        filter.connect(ctx.destination);
        break;
      case 'Консерт':
        delay.delayTime.value = 0.1;
        filter.type = 'lowpass';
        filter.frequency.value = 8000;
        source.connect(delay);
        delay.connect(filter);
        filter.connect(ctx.destination);
        break;
      default: // Стандарт
        source.connect(ctx.destination);
        break;
    }
  }, [soundMode, isActive]);

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const seek = (clientX: number) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newProgress = pos * 100;
      setProgress(newProgress);
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const handleProgressPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    seek(e.clientX);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handleProgressPointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      seek(e.clientX);
    }
  };

  const handleProgressPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
  };

  const toggleControls = () => {
    setShowControls(prev => !prev);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (!showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
  };

  const skip = (e: React.MouseEvent, amount: number) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="h-full w-full snap-start flex flex-col justify-center items-center relative bg-black">
      <div className="relative h-full w-full max-w-2xl flex flex-col justify-center">
        <div 
          className="relative aspect-[9/16] md:aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl cursor-pointer"
          onClick={toggleControls}
        >
          {item.type === 'video' ? (
            <video
              ref={videoRef}
              src={item.fileUrl}
              className="h-full w-full object-contain"
              autoPlay
              loop
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
            />
          ) : (
            <img
              src={item.thumbnail || item.fileUrl}
              alt={item.title}
              className="h-full w-full object-contain"
            />
          )}

          {/* Progress Bar */}
          {item.type === 'video' && (
            <div 
              ref={progressBarRef}
              className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 cursor-pointer z-20 group/progress touch-none"
              onPointerDown={handleProgressPointerDown}
              onPointerMove={handleProgressPointerMove}
              onPointerUp={handleProgressPointerUp}
              onPointerCancel={handleProgressPointerUp}
            >
              <div 
                className="h-full bg-[#E50914] transition-all duration-75 relative"
                style={{ width: `${progress}%` }}
              >
                <div className={`absolute right-[-6px] top-1/2 -translate-y-1/2 h-4 w-4 bg-[#E50914] rounded-full transition-opacity ${isDragging ? 'opacity-100 scale-125' : 'opacity-0 group-hover/progress:opacity-100'}`} />
              </div>
            </div>
          )}

          {/* Center Seek Controls */}
          <AnimatePresence>
            {showControls && item.type === 'video' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center gap-12 bg-black/30"
              >
                <button 
                  onClick={(e) => skip(e, -10)}
                  className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
                >
                  <RotateCcw className="h-10 w-10" />
                  <span className="text-xs font-bold">-10с</span>
                </button>

                <button 
                  onClick={togglePlay}
                  className="p-4 bg-white/20 rounded-full backdrop-blur-md text-white hover:scale-110 transition-transform"
                >
                  {isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current" />}
                </button>

                <button 
                  onClick={(e) => skip(e, 10)}
                  className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
                >
                  <RotateCw className="h-10 w-10" />
                  <span className="text-xs font-bold">+10с</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 to-transparent z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20">
                  {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
                </button>
                <button 
                  onClick={onToggleSound}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded text-xs text-white font-bold transition-all"
                >
                  Садо: {soundMode}
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                 <button onClick={() => setIsMuted(!isMuted)} className="text-white bg-white/10 p-2 rounded-full">
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                 </button>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-bold text-white mb-2">{item.title}</h2>
              <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
