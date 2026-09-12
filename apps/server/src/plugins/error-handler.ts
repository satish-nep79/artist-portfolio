import fp from 'fastify-plugin'
import type { FastifyError } from 'fastify'
import { buildErrorResponse } from '../schemas/response'
import { PublicRoutes } from '../constants/public-routes'
import { DEFAULT_ERROR_MESSAGES } from '../constants/error-messages'

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
  try {
    fastify.setErrorHandler((error, request, reply) => {
      const err = error as FastifyError;
      const fastifyError = error as FastifyError;
      const statusCode = fastifyError.statusCode ?? 500;
      fastify.log.error(`Error occurred during request to ${request.url}: ${err.message}`)

      const isHtmlRequest = request.headers.accept?.includes('text/html');

      const errorMessage = statusCode === 400
        ? getValidationMessage(fastifyError)
        : DEFAULT_ERROR_MESSAGES[statusCode] ?? DEFAULT_ERROR_MESSAGES[500];



      if (!isHtmlRequest) {
        return reply.status(statusCode).send(
          buildErrorResponse({
            status: statusCode,
            message: errorMessage,
          })
        )
      } else {
        return reply.status(statusCode).view(PublicRoutes.ERROR, {
          code: statusCode,
          title: statusCode === 404 ? 'Page Not Found' : 'Server Error',
          message: errorMessage,
          showBackBtn: true,
          primaryBtnText: 'Back to Login',
          primaryBtnLink: '/admin/login'
        });
      }

    });
  } catch (err) {
    fastify.log.error(`Error registering error handler plugin: ${err}`);
    throw err;
  }
})