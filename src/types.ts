export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  rating: string;
  duration: string;
  year: string;
  isNew?: boolean;
  type?: 'image' | 'video';
  fileUrl?: string; // For local files
}

export interface GalleryCategory {
  id: string;
  name: string;
  items: GalleryItem[];
}
