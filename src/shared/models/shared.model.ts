import { IsUUID } from 'class-validator';

export class IdParam {
  @IsUUID(4, { each: true })
  id: string;
}
