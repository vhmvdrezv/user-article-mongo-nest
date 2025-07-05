import { SuccessResponse } from "./success-response.interface";

export interface PaginatedResponse<T = any> extends SuccessResponse<T[]> {
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}