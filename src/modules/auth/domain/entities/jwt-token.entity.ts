export interface JwtPayload {
  sub: string;  // User ID
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

export class JwtToken {
  constructor(
    public readonly accessToken: string,
    public readonly payload: JwtPayload,
    public readonly expiresIn: number,
  ) {}

  static create(accessToken: string, payload: JwtPayload, expiresIn: number): JwtToken {
    return new JwtToken(accessToken, payload, expiresIn);
  }

  isExpired(): boolean {
    if (!this.payload.exp) return false;
    return Date.now() >= this.payload.exp * 1000;
  }
}