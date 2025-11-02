export interface JwtPayload {
  sub: number;
  publicId: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface RequestUser {
  id: number;
  publicId: string;
  roles: string[];
}
