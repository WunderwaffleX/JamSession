const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Live Jam Session API',
      version: '1.0.0',
      description: 'API for the Live Jam Session application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Путь к вашим файлам маршрутов
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
