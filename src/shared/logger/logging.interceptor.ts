import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, body, query, params, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    
    const correlationId = 
      headers['x-correlation-id'] || 
      request.correlationId ||
      this.generateCorrelationId();

    // Agregar correlationId al request para uso posterior
    request.correlationId = correlationId;

    // Log de entrada
    this.logger.log('🚀 Incoming HTTP Request', {
      correlationId,
      method,
      url,
      ip,
      userAgent: userAgent.substring(0, 100), // Limitar longitud
      query: Object.keys(query || {}).length > 0 ? query : undefined,
      params: Object.keys(params || {}).length > 0 ? params : undefined,
      body: this.sanitizeBody(body),
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;
        
        // Log de respuesta exitosa
        this.logger.log(`✅ HTTP Response [${statusCode}]`, {
          correlationId,
          method,
          url,
          statusCode,
          responseTime: `${responseTime}ms`,
          responseSize: this.getResponseSize(data),
          timestamp: new Date().toISOString(),
        });
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        const statusCode = error.status || 500;
        
        // Log de error
        this.logger.error(`❌ HTTP Error [${statusCode}]`, {
          correlationId,
          method,
          url,
          statusCode,
          responseTime: `${responseTime}ms`,
          errorMessage: error.message,
          errorName: error.name,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });

        return throwError(() => error);
      }),
    );
  }

  private generateCorrelationId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sensitiveFields = ['password', 'token', 'authorization', 'secret', 'key', 'pass'];
    const clone = Array.isArray(body) ? [...body] : { ...body };

    const sanitize = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(item => sanitize(item));
      }
      
      if (obj && typeof obj === 'object') {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
            cleaned[key] = '***HIDDEN***';
          } else if (typeof value === 'object') {
            cleaned[key] = sanitize(value);
          } else {
            cleaned[key] = value;
          }
        }
        return cleaned;
      }
      
      return obj;
    };

    return sanitize(clone);
  }

  private getResponseSize(data: any): string {
    if (!data) return '0 bytes';
    
    try {
      const size = JSON.stringify(data).length;
      if (size < 1024) return `${size} bytes`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } catch {
      return 'Unknown size';
    }
  }
}