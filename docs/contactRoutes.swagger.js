/**
 * @swagger
 * components:
 *   schemas:
 *     ContactRequest:
 *       type: object
 *       required: [name, email, subject, message]
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           example: jane@mail.com
 *         subject:
 *           type: string
 *           maxLength: 200
 *           example: Question about MyApp
 *         message:
 *           type: string
 *           maxLength: 5000
 *           example: Hi, I would like to know more about your plans.
 *     ContactResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Contact message sent successfully
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit a contact us message
 *     description: Sends the message to the configured support inbox (EMAIL_CONTACT_TO) with Reply-To set to the sender.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       200:
 *         description: Contact message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         description: Failed to send contact us email
 */
