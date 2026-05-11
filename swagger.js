const swaggerDocument = {
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
        },
      },
    },

    // UPLOAD ROUTES
    "/api/upload/single": {
      post: {
        summary: "Upload a single file",
        tags: ["Upload"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "File uploaded successfully" },
        },
      },
    },
    "/api/upload/multiple": {
      post: {
        summary: "Upload multiple files (up to 5)",
        tags: ["Upload"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  files: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Files uploaded successfully" },
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

module.exports = swaggerDocument;
