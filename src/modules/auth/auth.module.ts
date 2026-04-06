import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

// Domain
import { AuthRepository } from './domain/repositories/auth.repository';
import { TokenService } from './domain/services/token.service';
import { HashService } from './domain/services/hash.service';

// Application
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { ValidateTokenUseCase } from './application/use-cases/validate-token.use-case';

// Infrastructure
import { AuthRepositoryImpl } from './infrastructure/repositories/auth.repository.impl';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { BcryptHashService } from './infrastructure/services/bcrypt-hash.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';

// Presentation
import { AuthController } from './presentation/controllers/auth.controller';

// Shared
import { UserSchema } from '../users/infrastructure/database/user.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default-secret-key'),
        signOptions: { 
          expiresIn: '24h'
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    // Infrastructure Services - implementaciones concretas
    {
      provide: 'AuthRepository',
      useClass: AuthRepositoryImpl,
    },
    {
      provide: 'TokenService',
      useClass: JwtTokenService,
    },
    {
      provide: 'HashService',
      useClass: BcryptHashService,
    },

    // Use Cases - inyección manual para mantener independencia de framework
    {
      provide: LoginUseCase,
      useFactory: (
        authRepository: AuthRepository,
        tokenService: TokenService,
        hashService: HashService,
      ) => new LoginUseCase(authRepository, tokenService, hashService),
      inject: ['AuthRepository', 'TokenService', 'HashService'],
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        authRepository: AuthRepository,
        hashService: HashService,
      ) => new RegisterUseCase(authRepository, hashService),
      inject: ['AuthRepository', 'HashService'],
    },
    {
      provide: ValidateTokenUseCase,
      useFactory: (authRepository: AuthRepository) => 
        new ValidateTokenUseCase(authRepository),
      inject: ['AuthRepository'],
    },
    
    // Infrastructure
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    JwtAuthGuard,
    'HashService', // Para que otros módulos puedan usar el servicio de hash
  ],
})
export class AuthModule {}