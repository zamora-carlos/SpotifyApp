import apiFetch from './apiClient';
import type { SearchResponse, SearchType } from 'types/search.types';
import type { PaginatedResponse } from 'types/paginated-response.types';
import type { Artist } from 'types/artist.types';
import type { Track } from 'types/track.types';
import type { Album, SimplifiedAlbum } from 'types/album.types';
import type { Playlist } from 'types/playlist.types';

export function getTopArtists(token: string, page: number) {
  return apiFetch<PaginatedResponse<Artist>>(
    `/top/artists?token=${token}&page=${page}`
  );
}

export function getTopTracks(token: string, page: number) {
  return apiFetch<PaginatedResponse<Track>>(
    `/top/tracks?token=${token}&page=${page}`
  );
}

export function getArtistById(id: string, token: string) {
  return apiFetch<Artist>(`/artist/${id}?token=${token}`);
}

export function getArtistTopTracks(id: string, token: string) {
  return apiFetch<{ tracks: Track[] }>(
    `/artist/${id}/top-tracks?token=${token}`
  );
}

export function getRelatedArtists(id: string, token: string) {
  return apiFetch<{ artists: Artist[] }>(
    `/artist/${id}/related-artists?token=${token}`
  );
}

export function getAlbumById(id: string, token: string) {
  return apiFetch<Album>(`/album/${id}?token=${token}`);
}

export async function search(
  query: string,
  type: SearchType,
  page: number,
  token: string
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    query,
    type,
    page: page.toString(),
    token,
  }).toString();

  const data = await apiFetch(`/search?${params}`);

  switch (type) {
    case 'artist':
      return { type, data: data as PaginatedResponse<Artist> };
    case 'track':
      return { type, data: data as PaginatedResponse<Track> };
    case 'album':
      return { type, data: data as PaginatedResponse<SimplifiedAlbum> };
    case 'playlist':
      return { type, data: data as PaginatedResponse<Playlist> };
  }
}
