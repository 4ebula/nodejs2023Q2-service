import { randomUUID } from 'crypto';

export class Album {
  id: string;

  constructor(
    public name: string,
    public year: number,
    public artistId: string | null = null,
  ) {
    this.id = randomUUID();
  }

  update(name: string, year: number, artistId: string | null): Album {
    if (name) {
      this.name = name;
    }

    if (year) {
      this.year = year;
    }

    if (artistId !== undefined) {
      this.artistId = artistId;
    }

    return this;
  }

  updateArtist(artistId: string | null): Album {
    this.artistId = artistId;

    return this;
  }
}
