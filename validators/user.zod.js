const { z } = require('zod');

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const email = z.email({ error: 'A valid email address is required' });

const password = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .regex(
    PASSWORD_REGEX,
    'Password must contain uppercase, lowercase, number, and special character'
  );

const otpCode = z.string({ error: 'Code is required' }).regex(/^\d{6}$/, 'Code must be 6 digits');

const token = z.string({ error: 'Token is required' }).min(1, 'Token is required');

// role and isVerified are intentionally not accepted from clients
const profileFields = {
  firstName: z.string().trim().min(1, 'First name cannot be empty').max(50).optional(),
  lastName: z.string().trim().min(1, 'Last name cannot be empty').max(50).optional(),
  phone: z.string().trim().min(3, 'Phone must be at least 3 characters').max(20).optional(),
  profilePicUrl: z.url('Profile picture must be a valid URL').optional(),
};

const userCreateSchema = z.object({
  email,
  password,
  ...profileFields,
});

const userUpdateSchema = z
  .object({
    password: password.optional(),
    ...profileFields,
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

const userLoginSchema = z.object({
  email,
  password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
});

const sendResetPasswordCodeSchema = z.object({
  email,
});

const verifyResetPasswordCodeSchema = z.object({
  token,
  code: otpCode,
});

const updatePasswordSchema = z.object({
  email,
  password,
  token,
  code: otpCode,
});

const parseUserCreate = (data) => userCreateSchema.parse(data);
const parseUserUpdate = (data) => userUpdateSchema.parse(data);
const parseUserLogin = (data) => userLoginSchema.parse(data);
const parseSendResetPasswordCode = (data) => sendResetPasswordCodeSchema.parse(data);
const parseVerifyResetPasswordCode = (data) => verifyResetPasswordCodeSchema.parse(data);
const parseUpdatePassword = (data) => updatePasswordSchema.parse(data);

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  userLoginSchema,
  sendResetPasswordCodeSchema,
  verifyResetPasswordCodeSchema,
  updatePasswordSchema,
  parseUserCreate,
  parseUserUpdate,
  parseUserLogin,
  parseSendResetPasswordCode,
  parseVerifyResetPasswordCode,
  parseUpdatePassword,
};
