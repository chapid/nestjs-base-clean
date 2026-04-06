import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import { 
  DomainException, 
  UserAlreadyExistsException, 
  InvalidUserNameException,
  InvalidEmailException,
  UserNotFoundException 
} from '../../modules/users/domain/exceptions/user.exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: number;
    let message: string;
    let code: string;

    // Mapear excepciones de dominio a códigos HTTP apropiados
    if (exception instanceof UserAlreadyExistsException) {
      status = HttpStatus.CONFLICT; // 409
      message = exception.message;
      code = exception.code || 'USER_ALREADY_EXISTS';
    } else if (exception instanceof InvalidUserNameException || 
               exception instanceof InvalidEmailException) {
      status = HttpStatus.BAD_REQUEST; // 400
      message = exception.message;
      code = exception.code || 'INVALID_INPUT';
    } else if (exception instanceof UserNotFoundException) {
      status = HttpStatus.NOT_FOUND; // 404
      message = exception.message;
      code = exception.code || 'USER_NOT_FOUND';
    } else if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST; // 400 para otras excepciones de dominio
      message = exception.message;
      code = exception.code || 'DOMAIN_ERROR';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      code = 'HTTP_EXCEPTION';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR; // 500
      message = 'Error interno del servidor';
      code = 'INTERNAL_SERVER_ERROR';
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(process.env.NODE_ENV === 'development' && exception.stack && {
        stack: exception.stack
      })
    };

    // Log detallado del error
    if (status >= 500) {
      this.logger.error('💥 Server Error', {
        correlationId: request.correlationId,
        error: exception.message,
        stack: exception.stack,
        method: request.method,
        url: request.url,
        statusCode: status
      });
    } else if (status >= 400) {
      this.logger.warn('⚠️ Client Error', {
        correlationId: request.correlationId,
        error: exception.message,
        method: request.method,
        url: request.url,
        statusCode: status
      });
    }

    response.status(status).json(errorResponse);
  }
}