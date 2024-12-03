export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static BadRequest(message: string = 'Bad Request', details?: any) {
    return new ApiError(400, message, details);
  }

  static Unauthorized(message: string = 'Unauthorized', details?: any) {
    return new ApiError(401, message, details);
  }

  static Forbidden(message: string = 'Forbidden', details?: any) {
    return new ApiError(403, message, details);
  }

  static NotFound(message: string = 'Not Found', details?: any) {
    return new ApiError(404, message, details);
  }

  static MethodNotAllowed(message: string = 'Method Not Allowed', details?: any) {
    return new ApiError(405, message, details);
  }

  static Conflict(message: string = 'Conflict', details?: any) {
    return new ApiError(409, message, details);
  }

  static TooManyRequests(message: string = 'Too Many Requests', details?: any) {
    return new ApiError(429, message, details);
  }

  static InternalServer(message: string = 'Internal Server Error', details?: any) {
    return new ApiError(500, message, details);
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      details: this.details,
    };
  }
}
