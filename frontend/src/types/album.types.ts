import type { SimplifiedArtist } from './artist.types';
import type { Image } from './image.types';
import type { PaginatedResponse } from './paginated-response.types';
import type { SimplifiedTrack } from './track.types';

export type AlbumType = 'album' | 'single' | 'compilation';

export type SimplifiedAlbum = {
  id: string;
  name: string;
  images: Image[];
  artists: SimplifiedArtist[];
  album_type: AlbumType;
  total_tracks: number;
  release_date: string;
};

export type Album = SimplifiedAlbum & {
  label: string;
  popularity: number;
  tracks: PaginatedResponse<SimplifiedTrack>;
};
