import type { SimplifiedAlbum } from './album.types';
import type { SimplifiedArtist } from './artist.types';

export type SimplifiedTrack = {
  id: string;
  name: string;
  explicit: boolean;
  preview_url: string | null;
  duration_ms: number;
  artists: SimplifiedArtist[];
  track_number: number;
  disc_number: number;
};

export type Track = SimplifiedTrack & {
  popularity: number;
  album: SimplifiedAlbum;
};
