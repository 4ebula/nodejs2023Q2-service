import { randomUUID } from 'crypto';

export class Artist {
  id: string;

  constructor(public name: string, public grammy: boolean) {
    this.id = randomUUID();
  }

  update(name: string, grammy: boolean): Artist {
    if (name) {
      this.name = name;
    }

    if (grammy !== undefined) {
      this.grammy = grammy;
    }

    return this;
  }
}
