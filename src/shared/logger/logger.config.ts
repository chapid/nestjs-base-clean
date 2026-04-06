import * as winston from 'winston';

export interface LogMetadata {
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  operation?: string;
  duration?: string;
  [key: string]: any;
}

export interface CustomLoggerOptions {
  level?: string;
  enableFileLog?: boolean;
  logDirectory?: string;
  maxFileSize?: string;
  maxFiles?: number;
}

export class LoggerConfig {
  static createWinstonConfig(options: CustomLoggerOptions = {}): winston.LoggerOptions {
    const {
      level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
      enableFileLog = process.env.NODE_ENV === 'production',
      logDirectory = 'logs',
      maxFileSize = '20m',
      maxFiles = 14,
    } = options;

    const isProd = process.env.NODE_ENV === 'production';

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: LoggerConfig.getConsoleFormat(isProd),
      }),
    ];

    if (enableFileLog) {
      transports.push(
        new winston.transports.File({
          filename: `${logDirectory}/error.log`,
          level: 'error',
          maxsize: LoggerConfig.parseSize(maxFileSize),
          maxFiles,
          format: LoggerConfig.getFileFormat(),
        }),
        new winston.transports.File({
          filename: `${logDirectory}/combined.log`,
          maxsize: LoggerConfig.parseSize(maxFileSize),
          maxFiles,
          format: LoggerConfig.getFileFormat(),
        })
      );
    }

    return {
      level,
      transports,
      exitOnError: false,
    };
  }

  private static getConsoleFormat(isProd: boolean): winston.Logform.Format {
    return isProd
      ? winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
          winston.format.errors({ stack: true }),
          winston.format.json()
        )
      : winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
          winston.format.errors({ stack: true }),
          winston.format.colorize({ all: true }),
          winston.format.printf(({ level, message, timestamp, correlationId, ...meta }) => {
            const correlation = correlationId ? `[${correlationId}]` : '';
            
            if (typeof message === 'object') {
              return `${timestamp} ${level} ${correlation}: ${JSON.stringify(message, null, 2)}`;
            }
            
            let metaStr = '';
            const filteredMeta = LoggerConfig.filterMetadata(meta);
            if (Object.keys(filteredMeta).length > 0) {
              metaStr = `\n${JSON.stringify(filteredMeta, null, 2)}`;
            }
            
            return `${timestamp} ${level} ${correlation}: ${message}${metaStr}`;
          })
        );
  }

  private static getFileFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );
  }

  private static filterMetadata(meta: any): any {
    const filtered = { ...meta };
    delete filtered.timestamp;
    delete filtered.level;
    delete filtered.message;
    return filtered;
  }

  private static parseSize(size: string): number {
    const units: { [key: string]: number } = {
      b: 1,
      k: 1024,
      m: 1024 * 1024,
      g: 1024 * 1024 * 1024,
    };
    
    const match = size.toLowerCase().match(/(\d+)([kmg]?)/);
    if (!match) return 10 * 1024 * 1024; // default 10MB
    
    const value = parseInt(match[1]);
    const unit = match[2] || 'b';
    
    return value * (units[unit] || 1);
  }
}