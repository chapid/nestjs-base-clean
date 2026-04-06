import { AuthRepository } from '../../domain/repositories/auth.repository';
import { HashService } from '../../domain/services/hash.service';
import { AuthUser } from '../../domain/entities/auth-user.entity';
import { UserAlreadyExistsException } from '../../domain/exceptions/auth.exceptions';
import { v4 as uuidv4 } from 'uuid';

export class RegisterUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(name: string, email: string, password: string, avatar?: string): Promise<AuthUser> {
    // 1. Verificar que el usuario no existe
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsException(email);
    }

    // 2. Hashear la contraseña
    const passwordHash = await this.hashService.hash(password);

    // 3. Crear el usuario
    const userId = uuidv4();
    const user = AuthUser.create(userId, email, passwordHash, name);

    // 4. Guardar en la base de datos
    await this.authRepository.create(user);

    return user;
  }
}