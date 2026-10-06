/**
 * @swagger
 * components:
 *   schemas:
 *     HealthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [healthy, unhealthy]
 *         timestamp:
 *           type: string
 *           format: date-time
 *         environment:
 *           type: string
 *           example: development
 *         version:
 *           type: string
 *           example: 1.0.0
 *         database:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [connected, disconnected]
 *             readyState:
 *               type: integer
 *               description: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 *             name:
 *               type: string
 *         uptime:
 *           type: number
 *           description: Process uptime in seconds
 */

/**
 * @swagger
 * /health:
 *   servers:
 *     - url: /
 *       description: Health check is served from the root, outside /api/v1
 *   get:
 *     summary: Health check
 *     description: Used by Docker health checks. Returns 503 when the database is not connected.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
