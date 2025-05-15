import type { PaginatedResponse } from './paginated-response.types';
import type { Artist } from './artist.types';
import type { Track } from './track.types';
import type { SimplifiedAlbum } from './album.types';
import type { Playlist } from './playlist.types';

export const SEARCH_TYPES = [
  { label: 'Albums', value: 'album' },
  { label: 'Tracks', value: 'track' },
  { label: 'Artists', value: 'artist' },
  { label: 'Playlists', value: 'playlist' },
] as const;

export type SearchType = (typeof SEARCH_TYPES)[number]['value'];

export type SearchResponse =
  | { type: 'artist'; data: PaginatedResponse<Artist> }
  | { type: 'track'; data: PaginatedResponse<Track> }
  | { type: 'album'; data: PaginatedResponse<SimplifiedAlbum> }
  | { type: 'playlist'; data: PaginatedResponse<Playlist> };
