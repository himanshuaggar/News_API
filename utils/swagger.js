import expressListEndpoints from 'express-list-endpoints'
import swaggerjsdoc from "swagger-jsdoc";
import swagger from "swagger-ui-express";

const generateSwaggerDocs = (app) => {
    const routes = expressListEndpoints(app);
    const options = {
        openapi: "3.1.0",
        info: {
            title: "News API Docs",
            version: "0.0.1",
            description: "This is a simple News API made using Express with some modern Backend Sefvices like Authentication, Autorization, Caching, Loging, Rate Limiting, Pagination, Message Queues,",
            contact: {
                name: "Himanshu Aggarwal",
                email: "himanshuaggar00@gmail.com",
            },

            servers: [
                {
                    url: "http://localhost:3000/",
                    description: 'Server',
                },
            ],
        },
        paths: {},
    }

    // Generate Swagger paths based on Express routes
    routes.forEach(route => {
        const path = route.path;
        const methods = route.methods;

        methods.forEach(method => {
            const customSummary = `Route ${method.toUpperCase()}: ${path}`;
            if (!options.paths[path]) {
                options.paths[path] = {};
            }
            options.paths[path][method.toLowerCase()] = {
                summary: customSummary,
            };

            // Extract parameters from the route path
            const parameters = [];
            path.split('/').forEach(part => {
                if (part.startsWith(':')) {
                    const paramName = part.substring(1);
                    parameters.push({
                        in: 'path',
                        name: paramName,
                        required: true,
                        schema: {
                            type: 'string', // Adjust the type as needed
                        },
                    });
                }
            });

            // Add route parameters to the Swagger definition
            if (parameters.length > 0) {
                options.paths[path][method.toLowerCase()].parameters = parameters;
            }

            // Check if the route accepts a request body
            if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
                const acceptsRequestBody = route.middlewares && route.middlewares.includes('jsonParser');
                if (acceptsRequestBody) {
                    if (!options.paths[path][method.toLowerCase()].requestBody) {
                        options.paths[path][method.toLowerCase()].requestBody = {
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object', // Adjust the type as needed
                                        properties: {}, // Define properties based on your request body schema
                                    },
                                },
                            },
                        };
                    }
                }
            }
        });
    });


    return options;
}
const routeSchemas = {
    '/api/auth/register': {
      post: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'himanshu',
          },
          email: {
            type: 'string',
            example: 'himu12@gmail.com',
          },
          password: {
            type: 'string',
            example: '123456',
          },
          password_confirmation: {
            type: 'string',
            example: '123456',
          },
        },
      },
    },
    // Add more route schemas as needed
  };

export default generateSwaggerDocs;
