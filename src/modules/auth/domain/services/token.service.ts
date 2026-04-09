import { JwtToken, JwtPayload } from '../entities/jwt-token.entity';

export interface TokenService {
  generateToken(payload: JwtPayload): Promise<JwtToken>;
  validateToken(token: string): Promise<JwtPayload>;
}