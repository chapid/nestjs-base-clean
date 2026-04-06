import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

/**
 * Aquí sí usas Mongo, TypeORM, etc.
 * Aquí puedes cambiar a Mongo sin tocar el dominio
 */
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
  ) {}

  async create(user: User): Promise<User> {
    await this.userModel.create(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.userModel.findOne({ email });
    if (!data) return null;

    return new User(data.id, data.name, data.email, data.avatar);
  }
}