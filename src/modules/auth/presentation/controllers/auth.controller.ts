import { Controller, Post, Body, Get, UseGuards, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { Public } from '../decorators/public.decorator';
import { GetUser } from '../decorators/get-user.decorator';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { AuthExceptionFilter } from '../../infrastructure/filters/auth-exception.filter';

@ApiTags('auth')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.registerUseCase.execute(
      registerDto.name,
      registerDto.email,
      registerDto.password,
      registerDto.avatar,
    );

    return {
      message: 'Usuario registrado exitosamente',
      user: user.toSafeObject(),
    };
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({ status:404, description: 'Usuario no encontrado' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const token = await this.loginUseCase.execute(loginDto.email, loginDto.password);

    return {
      accessToken: token.accessToken,
      tokenType: 'Bearer',
      expiresIn: token.expiresIn,
      user: {
        id: token.payload.sub,
        email: token.payload.email,
        name: token.payload.name,
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getProfile(@GetUser() user: any) {
    return {
      message: 'Perfil del usuario autenticado',
      user,
    };
  }
}