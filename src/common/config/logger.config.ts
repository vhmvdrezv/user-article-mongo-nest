// src/common/config/logger.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const createLoggerConfig = (nodeEnv: string) => {
  // Define log format - this is the structure of our logs
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf((info: any) => {
      return JSON.stringify({
        timestamp: info.timestamp,
        level: info.level,
        message: info.message,
        context: info.context || 'Application',
        correlationId: info.correlationId,
        userId: info.userId,
        method: info.method,
        url: info.url,
        statusCode: info.statusCode,
        responseTime: info.responseTime,
        stack: info.stack,
        ...info.metadata
      });
    })
  );

  // Different transports (where logs go) based on environment
  const transports: winston.transport[] = [];

  if (nodeEnv === 'development') {
    // In development, also log to console with colors
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    );
  }

  // Always log to files
  transports.push(
    // All logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Error logs separately
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  return WinstonModule.createLogger({
    level: nodeEnv === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports,
  });
};