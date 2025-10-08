import swaggerUi from "swagger-ui-express";

export const openapi = {
  openapi: "3.0.0",
  info: {
    title: "MyContacts API",
    version: "1.0.0",
    description:
        "Documentation de l'API permettant de gérer l'authentification via JWT et la gestion des contacts personnels. Les endpoints peuvent être testés directement depuis Swagger UI."
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      AuthResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          user: {
            type: "object",
            properties: {
              id: { type: "string", example: "66f9f7cd9e1d9c001234abcd" },
              email: { type: "string", example: "utilisateur@example.com" },
              name: { type: "string", example: "Jane Doe" }
            }
          }
        }
      },
      ContactInput: {
        type: "object",
        required: ["firstName", "lastName", "phone"],
        properties: {
          firstName: { type: "string", example: "John" },
          lastName: { type: "string", example: "Smith" },
          phone: { type: "string", example: "+33 6 12 34 56 78" },
          email: { type: "string", example: "john.smith@example.com" }
        }
      },
      Contact: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67101a21e7a0e7001289abcd" },
          firstName: { type: "string", example: "John" },
          lastName: { type: "string", example: "Smith" },
          phone: { type: "string", example: "+33 6 12 34 56 78" },
          email: { type: "string", example: "john.smith@example.com" },
          ownerId: { type: "string", example: "66f9f7cd9e1d9c001234abcd" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          __v: { type: "integer", example: 3 }
        },
        example: {
          _id: "67101a21e7a0e7001289abcd",
          firstName: "John",
          lastName: "Smith",
          phone: "+33 6 12 34 56 78",
          email: "john.smith@example.com",
          ownerId: "66f9f7cd9e1d9c001234abcd",
          createdAt: "2025-10-01T12:34:56.000Z",
          updatedAt: "2025-10-07T13:22:11.000Z",
          __v: 3
        }
      }
    }
  },
  tags: [
    { name: "Auth", description: "Inscription et connexion" },
    { name: "Contacts", description: "Gestion des contacts personnels (JWT requis)" }
  ],
  paths: {
    "/auth/register": {
      post: {
        summary: "Inscrire un nouvel utilisateur",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "utilisateur@example.com" },
                  password: { type: "string", minLength: 8, example: "P@ssw0rd!" },
                  name: { type: "string", example: "Jane Doe" }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Utilisateur créé",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } }
          },
          "400": { description: "Requête invalide" },
          "409": { description: "Adresse e-mail déjà utilisée" }
        }
      }
    },
    "/auth/login": {
      post: {
        summary: "Connexion",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "utilisateur@example.com" },
                  password: { type: "string", example: "P@ssw0rd!" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Connexion réussie (JWT retourné)",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } }
          },
          "401": { description: "Accès refusé" }
        }
      }
    },
    "/contacts": {
      get: {
        summary: "Lister les contacts de l'utilisateur connecté",
        tags: ["Contacts"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Liste des contacts",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Contact" } }
              }
            }
          },
          "401": { description: "Authentification requise" }
        }
      }
    },
    "/contacts/new": {
      post: {
        summary: "Créer un nouveau contact",
        tags: ["Contacts"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ContactInput" } } }
        },
        responses: {
          "201": {
            description: "Contact créé avec succès",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Contact" } } }
          },
          "400": { description: "Requête invalide" },
          "401": { description: "Authentification requise" }
        }
      }
    },
    "/contacts/{id}": {
      patch: {
        summary: "Modifier un contact existant",
        tags: ["Contacts"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, example: "67101a21e7a0e7001289abcd" }
        ],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ContactInput" } } }
        },
        responses: {
          "200": {
            description: "Contact mis à jour avec succès",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Contact" },
                example: {
                  _id: "67101a21e7a0e7001289abcd",
                  firstName: "Jean",
                  lastName: "Dupont",
                  phone: "+33 6 12 34 56 78",
                  email: "jean.dupont@example.com",
                  ownerId: "66f9f7cd9e1d9c001234abcd",
                  createdAt: "2025-10-01T12:34:56.000Z",
                  updatedAt: "2025-10-07T13:45:02.000Z",
                  __v: 4
                }
              }
            }
          },
          "400": { description: "Requête invalide" },
          "401": { description: "Authentification requise" },
          "404": { description: "Contact non trouvé" }
        }
      },
      delete: {
        summary: "Supprimer un contact",
        tags: ["Contacts"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, example: "67101a21e7a0e7001289abcd" }
        ],
        responses: {
          "204": { description: "Contact supprimé (aucun contenu retourné)" },
          "401": { description: "Authentification requise" },
          "404": { description: "Contact non trouvé" }
        }
      }
    }
  }
};

export function mountSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi, { explorer: true }));
  app.get("/docs.json", (_req, res) => res.json(openapi));
}
