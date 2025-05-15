import type { Image } from './image.types';

export type Playlist = {
  id: string;
  name: string;
  images: Image[];
  description: string | null;
  tracks: { total: number };
};
