import swaggerUi from "swagger-ui-express";

export const openapi = {
  openapi: "3.0.0",
  info: {
    title: "MyContacts API",
    version: "1.0.0",
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "S'inscrire un nouvel utilisateur",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8},
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "L'utilisateur est créé"},
          "400": { description: "La requête invalide"},
          "409": { description: "L'email déjà utilisé"},
        }
      },
    },
    "/auth/login": {
      post: {
        summary: "Login",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "La connexion est succès (retourne JWT)" },
          "401": { description: "Accès refusé"}
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export function mountSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
  app.get("/docs.json", (_req, res) => res.json(openapi));
}


