import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { ImageService } from 'src/modules/users/domain/services/image.service';
import { UserAlreadyExistsException } from '../../domain/exceptions/user.exceptions';
import { Injectable, Inject } from '@nestjs/common';

/**
 * Aquí vive la lógica de negocio real.
 * 👉 Aquí está el cerebro del negocio
 * 👉 No sabe si usas Mongo, Postgres o lo que sea
 * 
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository,
    @Inject('ImageService') private readonly imageService: ImageService
    ) {}

  async execute(name: string, email: string): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);

    if (existing) {
      throw new UserAlreadyExistsException(email);
    }

    const avatar = await this.imageService.getRandomAvatar();
    const user = new User(uuid(), name, email, avatar);

    return this.userRepo.create(user);
  }
}