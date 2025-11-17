export interface JwtPayload {
  publicId: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface RequestUser {
  publicId: string;
  roles: string[];
}
