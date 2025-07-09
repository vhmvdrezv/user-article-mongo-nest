// src/common/services/logger.service.ts
import { Injectable, Inject, Scope } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  private getLogContext() {
    return {
      correlationId: this.request.correlationId,
      userId: this.request.userId,
      method: this.request.method,
      url: this.request.url,
    };
  }

  debug(message: string, context?: string, metadata?: any) {
    this.logger.debug(message, {
      context: context || 'Application',
      ...this.getLogContext(),
      metadata,
    });
  }

  info(message: string, context?: string, metadata?: any) {
    this.logger.info(message, {
      context: context || 'Application',
      ...this.getLogContext(),
      metadata,
    });
  }

  warn(message: string, context?: string, metadata?: any) {
    this.logger.warn(message, {
      context: context || 'Application',
      ...this.getLogContext(),
      metadata,
    });
  }

  error(message: string, error?: Error, context?: string, metadata?: any) {
    this.logger.error(message, {
      context: context || 'Application',
      ...this.getLogContext(),
      stack: error?.stack,
      metadata,
    });
  }
}