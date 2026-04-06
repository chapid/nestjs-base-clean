import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthUser } from '../../domain/entities/auth-user.entity';
import { UserNotFoundException } from '../../domain/exceptions/auth.exceptions';

export class ValidateTokenUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(userId: string): Promise<AuthUser> {
    // Verificar que el usuario aún existe
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}