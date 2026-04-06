import { AuthUser } from '../entities/auth-user.entity';

export abstract class AuthRepository {
  abstract findByEmail(email: string): Promise<AuthUser | null>;
  abstract findById(id: string): Promise<AuthUser | null>;
  abstract create(user: AuthUser): Promise<AuthUser>;
}