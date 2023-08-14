export enum Messages {
  NotFound = 'not found',
  AlreadyExists = 'already exists',
}

export class ForbiddenError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class ConflictError extends Error {
  constructor() {
    super();
  }
}

export class NotFoundError extends Error {
  constructor() {
    super();
  }
}
