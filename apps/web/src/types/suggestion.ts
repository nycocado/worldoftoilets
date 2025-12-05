import { ToiletResponseDto } from './toilet';
import { UserSuggestionResponseDto } from './user';

export interface SuggestionResponseDto {
  publicId: string;
  latitude: number;
  longitude: number;
  photoUrl: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  user: UserSuggestionResponseDto;
  toilet: ToiletResponseDto;
  reviewedAt: string | null;
  createdAt: string;
}

export interface CreateSuggestionRequestDto {
  latitude: number;
  longitude: number;
  toilet: {
    access: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state?: string;
    country: string;
    placeId?: string;
    extras?: string[];
  };
}
