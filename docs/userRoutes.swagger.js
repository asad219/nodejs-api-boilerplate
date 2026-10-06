/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 665f1c2e8b3e4a1d2c3b4a5f
 *         id:
 *           type: string
 *           example: 665f1c2e8b3e4a1d2c3b4a5f
 *         email:
 *           type: string
 *           format: email
 *           example: jane@mail.com
 *         firstName:
 *           type: string
 *           example: Jane
 *         lastName:
 *           type: string
 *           example: Doe
 *         phone:
 *           type: string
 *           example: '+15555550123'
 *         profilePicUrl:
 *           type: string
 *           format: uri
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           example: user
 *         isVerified:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserCreate:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: jane@mail.com
 *         password:
 *           type: string
 *           description: Min 8 characters with uppercase, lowercase, a number and a special character
 *           example: Str0ng!Pass
 *         firstName:
 *           type: string
 *           example: Jane
 *         lastName:
 *           type: string
 *           example: Doe
 *         phone:
 *           type: string
 *           example: '+15555550123'
 *         profilePicUrl:
 *           type: string
 *           format: uri
 *     UserUpdate:
 *       type: object
 *       description: At least one field is required
 *       properties:
 *         password:
 *           type: string
 *           example: N3w!Password
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         profilePicUrl:
 *           type: string
 *           format: uri
 *     UserLogin:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: jane@mail.com
 *         password:
 *           type: string
 *           example: Str0ng!Pass
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User registered successfully
 *         user:
 *           $ref: '#/components/schemas/User'
 *         verificationToken:
 *           type: string
 *           description: Short-lived token paired with the emailed 6-digit OTP for email verification
 *         expiresIn:
 *           type: string
 *           example: 15m
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Login successful
 *         token:
 *           type: string
 *           description: JWT access token (payload contains userId, email, role)
 *         user:
 *           $ref: '#/components/schemas/User'
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *     SendResetPasswordCodeRequest:
 *       type: object
 *       required: [email]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: jane@mail.com
 *     SendResetPasswordCodeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Reset password code sent successfully
 *         token:
 *           type: string
 *           description: Short-lived reset token; must be sent back together with the emailed code
 *         expiresIn:
 *           type: string
 *           example: 3m
 *     VerifyResetPasswordCodeRequest:
 *       type: object
 *       required: [token, code]
 *       properties:
 *         token:
 *           type: string
 *         code:
 *           type: string
 *           pattern: '^\d{6}$'
 *           example: '123456'
 *     VerifyResetPasswordCodeResponse:
 *       type: object
 *       properties:
 *         verified:
 *           type: boolean
 *         email:
 *           type: string
 *           format: email
 *     UpdatePasswordRequest:
 *       type: object
 *       required: [email, password, token, code]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: jane@mail.com
 *         password:
 *           type: string
 *           example: N3w!Password
 *         token:
 *           type: string
 *         code:
 *           type: string
 *           example: '123456'
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates the account and emails a 6-digit verification code (when email is enabled).
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in and receive a JWT access token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out (revokes the current token)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /users/send-reset-password-code:
 *   post:
 *     summary: Email a 6-digit password reset code
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendResetPasswordCodeRequest'
 *     responses:
 *       200:
 *         description: Reset code sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendResetPasswordCodeResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         description: Failed to send reset password email
 */

/**
 * @swagger
 * /users/verify-reset-password-code:
 *   post:
 *     summary: Check a password reset code without consuming it
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyResetPasswordCodeRequest'
 *     responses:
 *       200:
 *         description: Verification result (verified is false for wrong, expired or used tokens)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyResetPasswordCodeResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */

/**
 * @swagger
 * /users/update-password:
 *   post:
 *     summary: Set a new password using the reset token and code
 *     description: The reset token is revoked after a successful update.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid, expired or already used reset token, or wrong code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a user by ID (owner or admin)
 *     tags: [Users]
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
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users/update/{userId}:
 *   put:
 *     summary: Update a user's profile or password (owner or admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
