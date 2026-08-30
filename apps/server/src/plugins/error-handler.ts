import fp from 'fastify-plugin'
import type { FastifyError } from 'fastify'
import { buildErrorResponse } from '../schemas/response'

const getValidationMessage = (error: FastifyError): string => {
  const validationError = error.validation?.[0]

  if (!validationError) {
    return 'Request validation failed'
  }

  const params = validationError.params as {
    missingProperty?: string
    additionalProperty?: string
    type?: string
  }

  switch (validationError.keyword) {
    case 'required':
      return `${params.missingProperty ?? 'A required field'} is required`
    case 'additionalProperties':
      return `${params.additionalProperty ?? 'This field'} is not allowed`
    case 'type':
      return `${validationError.instancePath || 'Request body'} must be ${params.type ?? 'valid'}`
    case 'format':
      return `${validationError.instancePath || 'This field'} has an invalid format`
    default:
      return validationError.message ?? 'Request validation failed'
  }
}

export default fp(async (fastify, opts) => {
  fastify.setErrorHandler((error, request, reply) => {
    const fastifyError = error as FastifyError
    const statusCode = fastifyError.statusCode ?? 500
    return reply.status(statusCode).send(
      buildErrorResponse({
        status: statusCode,
        message: statusCode === 400
          ? getValidationMessage(fastifyError)
          : 'Request failed'
      })
    )
  })
})