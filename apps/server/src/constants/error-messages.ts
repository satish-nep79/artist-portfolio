// src/errors/app-error.ts

export const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: 'Bad Request. Please check your input.',
  401: 'Unauthorized access. Please log in.',
  403: 'Forbidden. You do not have permission to access this resource.',
  404: 'The requested resource was not found.',
  409: 'Conflict. The resource already exists.',
  422: 'Unprocessable Entity. Check validation rules.',
  500: 'An unexpected server error occurred. Please try again later.',
}

export class AppError extends Error {
  public readonly statusCode: number

  constructor(statusCode: number, customMessage?: string) {
    const message = customMessage ?? DEFAULT_ERROR_MESSAGES[statusCode] ?? 'An error occurred.'
    super(message)
    this.statusCode = statusCode
    Object.setPrototypeOf(this, AppError.prototype)
  }

  public static getMessageForStatus(statusCode: number, customMessage?: string): string {
    return customMessage ?? DEFAULT_ERROR_MESSAGES[statusCode] ?? DEFAULT_ERROR_MESSAGES[500]
  }
}