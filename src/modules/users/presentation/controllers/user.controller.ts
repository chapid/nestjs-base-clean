import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { Public } from '../../../auth/presentation/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto.name, dto.email);
  }
}