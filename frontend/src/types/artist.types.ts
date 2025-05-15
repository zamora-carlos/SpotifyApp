import type { Image } from './image.types';

export type SimplifiedArtist = {
  id: string;
  name: string;
};

export type Artist = SimplifiedArtist & {
  genres: string[];
  followers: {
    total: number;
  };
  images: Image[];
  popularity: number;
};
