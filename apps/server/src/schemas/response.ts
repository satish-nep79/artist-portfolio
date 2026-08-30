export const successResponseSchema = {
    type: 'object',
    properties: {
        status: { type: 'integer' },
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
            anyOf: [
                { type: 'object' },
                { type: 'array' },
                { type: 'null' },
            ],
        },
    },
    required: ['status', 'success', 'message'],
    additionalProperties: false,
} as const

export const errorResponseSchema = {
    type: 'object',
    properties: {
        status: { type: 'integer' },
        success: { type: 'boolean' },
        message: { type: 'string' },
    },
    required: ['status', 'success', 'message'],
    additionalProperties: false,
} as const

export const standardApiResponseSchema = {
    200: successResponseSchema,
    201: successResponseSchema,
    400: errorResponseSchema,
    401: errorResponseSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
    422: errorResponseSchema,
    500: errorResponseSchema,
} as const

export const buildSuccessResponse = <T>(status: number, message: string, data: T) => ({
    status,
    success: true,
    message,
    data,
})

export const buildErrorResponse = (status: number, message: string, data: null = null) => ({
    status,
    success: false,
    message,
})
