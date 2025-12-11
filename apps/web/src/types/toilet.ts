import { Access, TypeExtra, CommentRateToiletResponseDto } from './api';

export interface ToiletResponseDto {
  publicId: string;
  access: Access;
  extras: TypeExtra[];
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string | null;
  country: string;
  countryCode: string;
  photoUrl: string;
  placeId: string; // Google Places ID
  rating: CommentRateToiletResponseDto;
}

export interface CreateToiletRequestDto {
  name: string;
  access: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state?: string;
  country: string;
  placeId: string;
  extras: string[];
}

export interface UpdateToiletRequestDto {
  name?: string;
  access?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  country?: string;
  placeId?: string;
  extras?: string[];
}
