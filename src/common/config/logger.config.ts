import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const createLoggerConfig = (nodeEnv: string) => {
  // Define log format - this is the structure of our logs
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf((info: any) => {
      // Extract known fields and keep everything else as metadata
      const {
        timestamp,
        level,
        message,
        context,
        correlationId,
        userId,
        method,
        url,
        statusCode,
        responseTime,
        stack,
        ...otherFields
      } = info;

      return JSON.stringify({
        timestamp,
        level,
        message,
        context: context || 'Application',
        correlationId,
        userId,
        method,
        url,
        statusCode,
        responseTime,
        stack,
        // Include all other fields (like ip, userAgent, etc.)
        ...otherFields
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

  transports.push(
    // Error logs separately
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat,
      maxsize: 5242880,
      maxFiles: 5,
    })
  );

  return {
    level: nodeEnv === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports,
  };
};