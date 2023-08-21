import { SetMetadata } from '@nestjs/common';

export const SkipAuth = (doSkip: boolean = true) =>
  SetMetadata('skipAuth', doSkip);
