export const successResponseSchema = {
    type: 'object',
    properties: {
        status: { type: 'integer' },
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
            anyOf: [
                {
                    type: 'object',
                    additionalProperties: true,
                },
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

export const buildSuccessResponse = <T>({ status, message, data }: { status: number, message: string, data: T }) => ({
    status,
    success: true,
    message,
    data: data ?? null,
})

export const buildErrorResponse = ({ status, message }: { status: number, message: string }) => ({
    status,
    success: false,
    message,
})
