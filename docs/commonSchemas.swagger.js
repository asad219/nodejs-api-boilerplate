/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Validation Failed
 *         message:
 *           type: string
 *           example: Title is required
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Operation successful
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         total:
 *           type: integer
 *           example: 42
 *         pages:
 *           type: integer
 *           example: 5
 *   responses:
 *     BadRequest:
 *       description: Validation failed or invalid ID format
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Unauthorized:
 *       description: Missing, invalid, expired or revoked token
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Forbidden:
 *       description: Authenticated user is not allowed to access this resource
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     TooManyRequests:
 *       description: Rate limit exceeded
 */
