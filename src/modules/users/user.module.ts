import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './presentation/controllers/user.controller';
import { UserSchema } from './infrastructure/database/user.schema';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { RickMortyService } from './infrastructure/services/rick-morty.service';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    // Repositorio
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },

    // Servicio externo
    {
      provide: 'ImageService',
      useClass: RickMortyService,
    },

    // UseCase - Simple y directo
    CreateUserUseCase,
  ],
})
export class UsersModule {}