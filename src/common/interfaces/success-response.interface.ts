export interface SuccessResponse<T = any> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
}