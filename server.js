const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const logger = require('./config/logger');
const connectDb = require('./config/dbConnection');
const swaggerOptions = require('./config/swaggerConfig');
const healthRoutes = require('./routes/healthRoutes');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { version } = require('./package.json');

const app = express();

// HTTP request logging (piped into winston)
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Security headers
app.use(helmet());

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Body parsers for JSON and URL-encoded payloads
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Enable CORS pre-flight for all routes
app.options('*', cors());

// Connect to the database
connectDb();

// Health check endpoint
app.use('/health', healthRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// Centralized route registration
app.use('/api/v1', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`MyApp API v${version} is running on port ${config.port}`);
  logger.info(`Environment: ${config.env}`);
  logger.info(`API Documentation available at: http://localhost:${config.port}/api-docs`);
});
