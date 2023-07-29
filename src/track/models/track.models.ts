import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsOptional()
  artistId: string;

  @IsString()
  @IsOptional()
  albumId: string;
}

export class UpdateTrackdDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsOptional()
  artistId: string;

  @IsString()
  @IsOptional()
  albumId: string;
}

export interface TrackData {
  data: {
    name: string;
    duration: number;
    artistId: string | null;
    albumId: string | null;
  };
}
