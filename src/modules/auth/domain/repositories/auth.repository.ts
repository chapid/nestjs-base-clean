import { AuthUser } from '../entities/auth-user.entity';

export interface AuthRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  findById(id: string): Promise<AuthUser | null>;
  create(user: AuthUser): Promise<AuthUser>;
}