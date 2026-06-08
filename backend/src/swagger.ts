export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Medical Equipment Management API",
    version: "1.0.0",
    description:
      "API documentation for managing medical equipment, users, and system status",
  },
  servers: [
    {
      url: "/",
      description: "Current Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    // AUTH ROUTES
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "passwordConfirm"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  passwordConfirm: { type: "string" },
                  role: {
                    type: "string",
                    enum: ["Medic", "Engineer", "Admin"],
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Authenticate user and get tokens",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          400: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        summary: "Refresh the access token",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Token refreshed successfully" },
          401: { description: "Refresh token required" },
          403: { description: "Invalid refresh token" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        summary: "Logout user (client-side action)",
        tags: ["Auth"],
        responses: {
          200: { description: "Logout successful" },
        },
      },
    },

    // USER ROUTES
    "/api/users/me": {
      get: {
        summary: "Get currently authenticated user profile",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Current user profile" },
          401: { description: "Unauthorized" },
          404: { description: "User not found" },
        },
      },
    },
    "/api/users": {
      get: {
        summary: "Get all users (with 60s cache)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of users" },
          401: { description: "Unauthorized" },
        },
      },
      post: {
        summary: "Create a new user (Admin/Validated)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  role: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User created" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        summary: "Get user by ID",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "User found" },
          404: { description: "User not found" },
        },
      },
      delete: {
        summary: "Delete a user",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "User deleted" },
          404: { description: "User not found" },
        },
      },
    },
    "/api/users/{id}/password": {
      put: {
        summary: "Update user password",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["oldPassword", "newPassword"],
                properties: {
                  oldPassword: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password changed successfully" },
          400: { description: "Incorrect old password or validation error" },
          404: { description: "User not found" },
        },
      },
    },

    // EQUIPMENT ROUTES
    "/api/equipment": {
      post: {
        summary: "Add new equipment (Admin only)",
        tags: ["Equipment"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "serial_number", "next_maintenance"],
                properties: {
                  name: { type: "string", example: "Portable X-Ray" },
                  serial_number: { type: "string", example: "XR-99-B" },
                  next_maintenance: {
                    type: "string",
                    format: "date",
                    example: "2026-10-15",
                  },
                  status: {
                    type: "string",
                    enum: [
                      "Active",
                      "Warning",
                      "Maintenance",
                      "Decommissioned",
                    ],
                    description: "Optional: Defaults to Active",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Equipment created successfully" },
          400: { description: "Validation error or duplicate serial number" },
          403: { description: "Forbidden (Requires Admin role)" },
        },
      },
      get: {
        summary: "Get all equipment (Catalog)",
        tags: ["Equipment"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of all medical equipment" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/equipment/{id}": {
      get: {
        summary: "Get equipment details and maintenance logs",
        tags: ["Equipment"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Equipment details retrieved successfully" },
          404: { description: "Equipment not found" },
        },
      },
    },
    "/api/equipment/{id}/report": {
      post: {
        summary: "Report an issue (Changes status to Warning)",
        tags: ["Equipment"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Issue reported successfully" },
          404: { description: "Equipment not found" },
        },
      },
    },
    "/api/equipment/{id}/maintenance": {
      post: {
        summary: "Log maintenance (Engineer only)",
        tags: ["Equipment"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["description"],
                properties: {
                  description: { type: "string" },
                  newStatus: {
                    type: "string",
                    enum: [
                      "Active",
                      "Warning",
                      "Maintenance",
                      "Decommissioned",
                    ],
                    description: "Optional: Update the equipment status",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Maintenance logged successfully" },
          400: { description: "Validation error" },
          403: { description: "Forbidden (Requires Engineer role)" },
          404: { description: "Equipment not found" },
        },
      },
    },

    // SYSTEM ROUTES
    "/status": {
      get: {
        summary: "Check server health and performance metrics",
        tags: ["System"],
        responses: {
          200: { description: "Server is healthy" },
        },
      },
    },
  },
};

export default swaggerDocument;
