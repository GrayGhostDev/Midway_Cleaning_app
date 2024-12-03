import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', // API routes folder
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Midway Cleaning API Documentation',
        version: '1.0.0',
        description: 'API documentation for the Midway Cleaning Company dashboard',
        contact: {
          name: 'API Support',
          email: 'support@midwaycleaning.com',
        },
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
          description: 'API Server',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              status: {
                type: 'number',
                example: 400,
              },
              message: {
                type: 'string',
                example: 'Bad Request',
              },
              details: {
                type: 'object',
                example: {
                  field: ['validation error message'],
                },
              },
            },
          },
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
              },
              name: {
                type: 'string',
              },
              email: {
                type: 'string',
                format: 'email',
              },
              role: {
                type: 'string',
                enum: ['ADMIN', 'MANAGER', 'EMPLOYEE', 'CLIENT'],
              },
            },
          },
          Task: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
              },
              title: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
              status: {
                type: 'string',
                enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
              },
              priority: {
                type: 'string',
                enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
              },
              assigneeId: {
                type: 'string',
                format: 'uuid',
              },
              locationId: {
                type: 'string',
                format: 'uuid',
              },
              dueDate: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
  });

  return spec;
};

// Example route documentation
/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve a list of tasks with optional filtering and pagination
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED]
 *         description: Filter tasks by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
