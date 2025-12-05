import { ToiletResponseDto } from './toilet';
import { UserAdminResponseDto } from './user';

export interface ApplyPartnerRequestDto {
  toiletPublicId: string;
  contactEmail: string;
}

export interface PartnerApplicationResponseDto {
  publicId: string;
  status: 'pending' | 'active' | 'inactive' | 'rejected';
  contactEmail: string;
  createdAt: string;
}

export interface PartnerSelfResponseDto {
  publicId: string;
  toilet: ToiletResponseDto;
  certificate: string;
  contactEmail: string;
  status: 'pending' | 'active' | 'inactive' | 'rejected';
  createdAt: string;
  reviewedAt: string | null;
}

export interface PartnerAdminResponseDto {
  publicId: string;
  user: UserAdminResponseDto | null;  // null if pending
  toilet: ToiletResponseDto;
  certificate: string | null;  // URL
  contactEmail: string;
  status: 'pending' | 'active' | 'inactive' | 'rejected';
  reviewedBy: UserAdminResponseDto | null;
  createdAt: string;
  reviewedAt: string | null;
  updatedAt: string;
}

export interface UpdatePartnerRequestDto {
  contactEmail?: string;
}
