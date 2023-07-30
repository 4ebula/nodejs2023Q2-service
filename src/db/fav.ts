import { Album } from './album';
import { Artist } from './artist';
import { Track } from './track';

export enum FavKeys {
  Artist = 'artists',
  Album = 'albums',
  Track = 'tracks',
}

export interface Fav {
  [FavKeys.Artist]: Artist[];
  [FavKeys.Album]: Album[];
  [FavKeys.Track]: Track[];
}
