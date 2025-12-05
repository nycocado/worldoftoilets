// Base API Response Structure
export interface ApiResponse<T> {
  message: string;
  data: T;
  statusCode: number;
}

// Pagination
export interface PaginationParams {
  page: number;
  size: number;
  timestamp?: string;
}

// Common types
export interface Role {
  name: string;
  apiName: string;
}

export interface Access {
  name: string;  // "Público", "Privado", "Só consumidores"
  apiName: 'public' | 'private' | 'consumers-only';
}

export interface TypeExtra {
  name: string;  // "Acessível para cadeira de rodas"
  apiName: 'wheelchair-accessible' | 'baby-changing-station' | 'disabled-parking' | 'accessible-for-visually-impaired';
}

export interface CommentRateToiletResponseDto {
  clean: number;
  paper: number;
  structure: number;
  accessibility: number;
  count: number;
}

export interface CommentRateCommentResponseDto {
  clean: number;
  paper: boolean;
  structure: number;
  accessibility: number;
}
