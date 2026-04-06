import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { 
  InvalidCredentialsException,
  UserNotFoundException,
  UserAlreadyExistsException,
  InvalidTokenException,
  ExpiredTokenException,
} from '../../domain/exceptions/auth.exceptions';

@Catch(
  InvalidCredentialsException,
  UserNotFoundException,
  UserAlreadyExistsException,
  InvalidTokenException,
  ExpiredTokenException,
)
export class AuthExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AuthExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: HttpStatus;
    let message: string;
    let error: string;

    if (exception instanceof InvalidCredentialsException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
      error = 'Unauthorized';
    } else if (exception instanceof UserNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
      error = 'Not Found';
    } else if (exception instanceof UserAlreadyExistsException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
      error = 'Conflict';
    } else if (exception instanceof InvalidTokenException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
      error = 'Unauthorized';
    } else if (exception instanceof ExpiredTokenException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
      error = 'Unauthorized';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
      error = 'Internal Server Error';
    }

    this.logger.error(`Auth Exception: ${exception.message}`, exception.stack);

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}