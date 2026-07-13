import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * OpenAPI 3.0 specification endpoint.
 * Returns the full API spec as JSON.
 * Accessible at: GET /api/openapi
 */
const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Toyga API',
    description:
      'REST API for Toyga — wedding invitation platform.\n\n' +
      '**Authentication**: Most endpoints require a JWT token sent as a cookie (`token`) ' +
      'or in the `Authorization: Bearer <token>` header.',
    version: '1.0.0',
    contact: {
      name: 'Toyga Support',
      url: 'https://toyga.kz',
    },
  },
  servers: [
    {
      url: 'https://toyga.kz',
      description: 'Production',
    },
    {
      url: 'http://localhost:5173',
      description: 'Local development',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token (also accepted via `token` cookie)',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Resource not found' },
          code: { type: 'string', example: 'NOT_FOUND' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Validation failed' },
          code: { type: 'string', example: 'VALIDATION_ERROR' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
      Template: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          category_id: { type: 'string' },
          preview_url: { type: 'string' },
          price: { type: 'number' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          user_id: { type: 'string' },
          template_id: { type: 'string' },
          status: {
            type: 'string',
            enum: ['pending', 'paid', 'cancelled'],
          },
          amount: { type: 'number' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Invitation: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          user_id: { type: 'string' },
          template_id: { type: 'string' },
          title: { type: 'string' },
          data: {
            type: 'object',
            description: 'Custom invitation fields (names, date, venue, etc.)',
          },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Guest: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          invitation_id: { type: 'string' },
          name: { type: 'string' },
          phone: { type: 'string' },
          rsvp_status: {
            type: 'string',
            enum: ['pending', 'accepted', 'declined'],
          },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication & user session' },
    { name: 'Templates', description: 'Wedding invitation templates' },
    { name: 'Categories', description: 'Template categories' },
    { name: 'Orders', description: 'Orders & payments' },
    { name: 'Invitations', description: 'User wedding invitations' },
    { name: 'Guests', description: 'Guest list management' },
    { name: 'Media', description: 'File uploads & media' },
    { name: 'Admin', description: 'Admin-only endpoints' },
  ],
  paths: {
    // ─── Auth ───────────────────────────────────────────────────────────────
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Akim' },
                  email: { type: 'string', format: 'email', example: 'akim@example.com' },
                  password: { type: 'string', minLength: 8, example: 'secret123' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
          '409': { description: 'Email already in use', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email & password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful (sets `token` cookie)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '403': { description: 'Account suspended', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout (clears session cookie)',
        responses: {
          '200': { description: 'Logged out successfully' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user info',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current user',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/otp-request': {
      post: {
        tags: ['Auth'],
        summary: 'Request OTP code (passwordless login)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'OTP sent to email' },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
        },
      },
    },
    '/api/auth/otp-verify': {
      post: {
        tags: ['Auth'],
        summary: 'Verify OTP code and get session',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'code'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  code: { type: 'string', example: '123456' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'OTP verified, session started',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid or expired code', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // ─── Templates ──────────────────────────────────────────────────────────
    '/api/templates': {
      get: {
        tags: ['Templates'],
        summary: 'List all templates',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category slug' },
        ],
        responses: {
          '200': {
            description: 'List of templates',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Template' },
                },
              },
            },
          },
        },
      },
    },
    '/api/templates/{id}': {
      get: {
        tags: ['Templates'],
        summary: 'Get a template by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Template details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Template' },
              },
            },
          },
          '404': { description: 'Template not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // ─── Categories ─────────────────────────────────────────────────────────
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List all template categories',
        responses: {
          '200': {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Category' },
                },
              },
            },
          },
        },
      },
    },

    // ─── Orders ─────────────────────────────────────────────────────────────
    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: "Get current user's orders",
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of orders',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Order' },
                },
              },
            },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['template_id'],
                properties: {
                  template_id: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Order created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // ─── Invitations ────────────────────────────────────────────────────────
    '/api/invitations': {
      get: {
        tags: ['Invitations'],
        summary: "Get current user's invitations",
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of invitations',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Invitation' },
                },
              },
            },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        tags: ['Invitations'],
        summary: 'Create a new invitation',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['template_id', 'title'],
                properties: {
                  template_id: { type: 'string' },
                  title: { type: 'string' },
                  data: { type: 'object', description: 'Custom invitation fields' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Invitation created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Invitation' },
              },
            },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/invitations/{slug}': {
      get: {
        tags: ['Invitations'],
        summary: 'Get a public invitation by slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Invitation details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Invitation' },
              },
            },
          },
          '404': { description: 'Invitation not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // ─── Guests ─────────────────────────────────────────────────────────────
    '/api/guests/{invitationId}': {
      get: {
        tags: ['Guests'],
        summary: 'Get guests for an invitation',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'invitationId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'List of guests',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Guest' },
                },
              },
            },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // ─── Media / Upload ─────────────────────────────────────────────────────
    '/api/upload': {
      post: {
        tags: ['Media'],
        summary: 'Upload a file (photo, video, audio)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' },
                  type: { type: 'string', enum: ['photo', 'video', 'audio'] },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'File uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    url: { type: 'string', format: 'uri' },
                    fileId: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid file', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
  },
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(openApiSpec);
}
