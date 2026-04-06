import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../domain/entities/jwt-token.entity';
import { ValidateTokenUseCase } from '../../application/use-cases/validate-token.use-case';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default-secret-key'),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      // Validamos que el usuario aún exista en la base de datos
      const user = await this.validateTokenUseCase.execute(payload.sub);
      
      // Devolvemos la información del usuario que será agregada al request
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}