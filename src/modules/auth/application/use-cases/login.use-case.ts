import { Injectable, Inject } from '@nestjs/common';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { TokenService } from '../../domain/services/token.service';
import { HashService } from '../../domain/services/hash.service';
import { JwtToken, JwtPayload } from '../../domain/entities/jwt-token.entity';
import { InvalidCredentialsException, UserNotFoundException } from '../../domain/exceptions/auth.exceptions';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: AuthRepository,
    @Inject('TokenService')
    private readonly tokenService: TokenService,
    @Inject('HashService')
    private readonly hashService: HashService,
  ) {}

  async execute(email: string, password: string): Promise<JwtToken> {
    // 1. Buscar usuario por email
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException(email);
    }

    // 2. Verificar password
    const isValidPassword = await this.hashService.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new InvalidCredentialsException();
    }

    // 3. Generar token JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return this.tokenService.generateToken(payload);
  }
}