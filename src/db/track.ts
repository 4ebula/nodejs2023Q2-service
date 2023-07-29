import { randomUUID } from 'crypto';

export class Track {
  id: string;

  constructor(
    public name: string,
    public duration: number,
    public artistId: string | null = null,
    public albumId: string | null = null,
  ) {
    this.id = randomUUID();
  }

  update(
    name: string,
    duration: number,
    artistId: string | null,
    albumId: string | null,
  ): Track {
    if (name) {
      this.name = name;
    }

    if (duration) {
      this.duration = duration;
    }

    if (artistId !== undefined) {
      this.artistId = artistId;
    }

    if (albumId !== undefined) {
      this.albumId = albumId;
    }

    return this;
  }

  updateArtist(artistId: string | null): Track {
    this.artistId = artistId;

    return this;
  }

  updateAlbum(albumId: string | null): Track {
    this.albumId = albumId;

    return this;
  }
}
