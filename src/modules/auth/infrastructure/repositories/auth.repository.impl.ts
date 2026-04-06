import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthUser } from '../../domain/entities/auth-user.entity';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
  ) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const data = await this.userModel.findOne({ email, passwordHash: { $exists: true } });
    if (!data || !data.passwordHash) return null;

    return new AuthUser(
      data.id,
      data.email,
      data.passwordHash,
      data.name,
      data.createdAt || new Date(),
    );
  }

  async findById(id: string): Promise<AuthUser | null> {
    const data = await this.userModel.findOne({ id, passwordHash: { $exists: true } });
    if (!data || !data.passwordHash) return null;

    return new AuthUser(
      data.id,
      data.email,
      data.passwordHash,
      data.name,
      data.createdAt || new Date(),
    );
  }

  async create(user: AuthUser): Promise<AuthUser> {
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      avatar: '', // Valor por defecto
      createdAt: user.createdAt,
    };

    await this.userModel.create(userData);
    return user;
  }
}