import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../domain/services/token.service';
import { JwtToken, JwtPayload } from '../../domain/entities/jwt-token.entity';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: JwtPayload): Promise<JwtToken> {
    // Configuración por defecto: 24 horas
    const expiresIn = 24 * 60 * 60; // 24 horas en segundos
    
    const accessToken = await this.jwtService.signAsync({
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    }, {
      expiresIn,
    });

    return JwtToken.create(accessToken, { ...payload }, expiresIn);
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        iat: decoded.iat,
        exp: decoded.exp,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}