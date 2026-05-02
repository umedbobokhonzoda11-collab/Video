import { GalleryCategory, GalleryItem } from './types';

export const FEATURED_ITEM: GalleryItem = {
  id: 'featured-empty',
  title: 'Галереяи Шахсии Шумо',
  description: 'Файлҳои худро аз телефон боргузорӣ кунед, то онҳоро дар ин ҷо бо услуби Netflix тамошо кунед.',
  thumbnail: 'https://images.unsplash.com/photo-1493397212122-2b85def8d0b0?auto=format&fit=crop&q=80&w=1920&h=1080',
  category: 'Хуш омадед',
  rating: '100%',
  duration: 'Холӣ',
  year: '2024',
  isNew: true
};

export const CATEGORIES: GalleryCategory[] = [
  {
    id: 'sample',
    name: 'Намуна барои санҷиши садо',
    items: [
      {
        id: 'sample-video-1',
        title: 'Табиати Зебо (бо садо)',
        description: 'Ин видео дорои садои табиат аст. Шумо метавонед намудҳои садоро дар ин ҷо санҷед.',
        thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
        fileUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        category: 'Намуна',
        rating: '100%',
        duration: '00:46',
        year: '2024',
        type: 'video',
        isNew: true
      }
    ]
  }
];
