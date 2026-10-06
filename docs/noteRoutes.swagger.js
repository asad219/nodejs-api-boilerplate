/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 665f1c2e8b3e4a1d2c3b4a60
 *         userId:
 *           type: string
 *           description: Owner user ID (populated with _id, firstName, lastName, email in the admin list)
 *           example: 665f1c2e8b3e4a1d2c3b4a5f
 *         title:
 *           type: string
 *           example: Shopping list
 *         content:
 *           type: string
 *           example: Milk, eggs, bread
 *         isPinned:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     NoteCreate:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *           example: Shopping list
 *         content:
 *           type: string
 *           maxLength: 10000
 *           example: Milk, eggs, bread
 *         isPinned:
 *           type: boolean
 *           example: false
 *     NoteUpdate:
 *       type: object
 *       description: At least one field is required
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *         content:
 *           type: string
 *           maxLength: 10000
 *         isPinned:
 *           type: boolean
 *     NoteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Note created successfully
 *         note:
 *           $ref: '#/components/schemas/Note'
 *     NoteListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         notes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Note'
 *     NotePaginatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         notes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Note'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a note for the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteCreate'
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   get:
 *     summary: List all notes with pagination (admin only)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotePaginatedResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /notes/user/{userId}:
 *   get:
 *     summary: Get all notes for a user (owner or admin)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notes for the user, pinned first then newest first
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteListResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /notes/{noteId}:
 *   put:
 *     summary: Update a note (owner or admin)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteUpdate'
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a note (owner or admin)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Note deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
