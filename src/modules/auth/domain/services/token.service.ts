import { JwtToken, JwtPayload } from '../entities/jwt-token.entity';

export abstract class TokenService {
  abstract generateToken(payload: JwtPayload): Promise<JwtToken>;
  abstract validateToken(token: string): Promise<JwtPayload>;
}