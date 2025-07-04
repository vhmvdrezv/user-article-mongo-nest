// src/common/filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.getErrorResponse(exception);
    
    this.logError(request, exception, errorResponse);

    response.status(errorResponse.statusCode).json({
      success: false,
      statusCode: errorResponse.statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorResponse.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: errorResponse.stack 
      })
    });
  }

  private getErrorResponse(exception: unknown): {
    statusCode: number;
    message: string;
    stack?: string;
  } {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        message = (response as any).message || exception.message;
      }
      stack = exception.stack;
    } else if (exception instanceof MongoError) {
      // Handle MongoDB specific errors
      statusCode = HttpStatus.BAD_REQUEST;
      message = this.handleMongoError(exception);
      stack = exception.stack;
    } else if (exception instanceof Error) {
      if (this.isMongooseError(exception)) {
        statusCode = this.getMongooseErrorStatus(exception);
        message = this.handleMongooseError(exception);
      } else {
        message = exception.message;
      }
      stack = exception.stack;
    } else {
      // Handle unknown error types
      message = 'An unexpected error occurred';
    }

    return { statusCode, message, stack };
  }

  private isMongooseError(error: Error): boolean {
    return [
      'CastError',
      'ValidationError',
      'ValidatorError',
      'DocumentNotFoundError',
      'VersionError',
      'ParallelSaveError',
      'MongooseError'
    ].includes(error.name);
  }

  private getMongooseErrorStatus(error: any): number {
    switch (error.name) {
      case 'CastError':
        return HttpStatus.BAD_REQUEST;
      case 'ValidationError':
        return HttpStatus.BAD_REQUEST;
      case 'DocumentNotFoundError':
        return HttpStatus.NOT_FOUND;
      case 'VersionError':
        return HttpStatus.CONFLICT;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private handleMongoError(error: MongoError): string {
    switch (error.code) {
      case 11000:
        // Duplicate key error
        const duplicateField = this.extractDuplicateField(error.message);
        return `${duplicateField} already exists. Please use a different value.`;
      
      case 11001:
        return 'Duplicate key error occurred';
      
      case 12000:
        return 'Database file size exceeded';
      
      case 13:
        return 'Unauthorized database operation';
      
      default:
        return 'Database operation failed';
    }
  }

  private handleMongooseError(error: any): string {
    if (error.name === 'CastError') {
      if (error.kind === 'ObjectId') {
        return 'Invalid ID format provided';
      }
      return `Invalid ${error.path} format`;
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return `Validation failed: ${errors.join(', ')}`;
    }
    
    if (error.name === 'DocumentNotFoundError') {
      return 'Resource not found';
    }
    
    if (error.name === 'VersionError') {
      return 'Document was modified by another process';
    }
    
    return error.message || 'Database operation failed';
  }

  private extractDuplicateField(errorMessage: string): string {
    // Extract field name from MongoDB duplicate key error
    const match = errorMessage.match(/index: (.+?)_/);
    if (match && match[1]) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
    return 'Field';
  }

  private logError(
    request: Request,
    exception: unknown,
    errorResponse: { statusCode: number; message: string; stack?: string }
  ): void {
    const { statusCode, message } = errorResponse;
    const { method, url } = request;
    
    const logMessage = `${method} ${url} - ${statusCode} - ${message}`;
    
    if (statusCode >= 500) {
      this.logger.error(logMessage, exception instanceof Error ? exception.stack : 'Unknown error');
    } else {
      this.logger.warn(logMessage);
    }
  }
}