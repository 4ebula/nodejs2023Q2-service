import { IsNotEmpty, IsString } from 'class-validator';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
