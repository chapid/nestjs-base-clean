import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerService } from '@nestjs/common';

const isProd = process.env.NODE_ENV === 'production';

export const WinstonLogger: LoggerService = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: isProd
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(), // PROD → JSON
          )
        : winston.format.combine(
            winston.format.colorize(), // DEV → colores
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
              if (typeof message === 'object') {
                return `${timestamp} ${level}: ${JSON.stringify(message, null, 2)}`;
              }
              return `${timestamp} ${level}: ${message}`;
            }),
          ),
    }),
  ],
});