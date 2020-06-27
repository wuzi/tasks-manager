/*
  |--------------------------------------------------------------------------
  | Swagger Information
  | Please use Swagger 2 Specification Docs
  | https://swagger.io/docs/specification/2-0/basic-structure/
  |--------------------------------------------------------------------------
  */
import swaggerJSDoc from 'swagger-jsdoc';

const config = {
  swaggerDefinition: {
    info: {
      title: 'Tasks Manager API',
      version: '0.1.0',
    },

    basePath: '/v1',

    securityDefinitions: {},
  },

  securitySchemes: {},

  apis: ['swagger.yml'],
};

const options = swaggerJSDoc(config);

export default options;
