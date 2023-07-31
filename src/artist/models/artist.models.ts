import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface ArtistInfo {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}

export class UpdateArtistdDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsBoolean()
  @IsOptional()
  grammy: boolean;
}

export interface ArtistData {
  data: {
    name: string;
    grammy: boolean;
  };
}
