const config = require('./index');
const { version } = require('../package.json');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyApp API',
      version,
      description: 'API documentation for MyApp Backend Services',
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://api.myapp.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './docs/*.js'],
};

module.exports = swaggerOptions;
