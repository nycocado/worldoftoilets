export class ApiResponseDto<T = unknown> {
  message: string;
  data?: T;
  statusCode: number;

  constructor(message: string, data?: T, statusCode = 200) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
