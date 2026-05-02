import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { GalleryItem } from '../types';
import ItemCard from './ItemCard';

interface RowProps {
  title: string;
  items: GalleryItem[];
}

export default function Row({ title, items }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-40 space-y-2 px-4 md:px-12 md:h-52">
      <h2 className="text-lg font-semibold text-white transition-colors duration-200 hover:text-gray-300 md:text-2xl">
        {title}
      </h2>
      
      <div className="group relative md:-ml-2">
        <ChevronLeft
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        />

        <div
          ref={rowRef}
          className="flex items-center gap-2 overflow-x-scroll scrollbar-hide"
        >
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        <ChevronRight
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
}
