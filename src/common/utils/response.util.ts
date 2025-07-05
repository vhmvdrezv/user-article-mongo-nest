import { HttpStatus } from "@nestjs/common";
import { SuccessResponse } from "../interfaces/success-response.interface";
import { PaginatedResponse } from "../interfaces/paginated-response.interfact";

export class ResponseUtil {
    static success<T>(
        data: T,
        message: string = 'Operation successfull',
        statusCode: number = HttpStatus.OK
    ): SuccessResponse<T> {
        return {
            success: true,
            statusCode,
            message,
            data,
            timestamp: new Date().toISOString(),
        }
    }

    static created<T>(
        data: T,
        message: string = 'Resource created successfully',
    ): SuccessResponse<T> {
        return this.success(data, message, HttpStatus.CREATED);
    }

    static paginated<T>(
        data: T[],
        pagination: {
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
        hasNext: boolean;
        hasPrev: boolean;
        },
        message: string = 'Resources retrieved successfully',
    ): PaginatedResponse<T> {
        return {
        success: true,
        statusCode: HttpStatus.OK,
        message,
        data,
        pagination,
        timestamp: new Date().toISOString(),
        };
    }

    static noContent(message: string = 'Operation completed successfully'): SuccessResponse<null> {
        return this.success(null, message, HttpStatus.NO_CONTENT);
    }
}