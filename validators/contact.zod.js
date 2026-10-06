const { z } = require('zod');

const contactUsSchema = z.object({
  name: z.string({ error: 'Name is required' }).trim().min(1, 'Name is required').max(100),
  email: z.email({ error: 'A valid email address is required' }),
  subject: z.string({ error: 'Subject is required' }).trim().min(1, 'Subject is required').max(200),
  message: z
    .string({ error: 'Message is required' })
    .trim()
    .min(1, 'Message is required')
    .max(5000),
});

const parseContactUs = (data) => contactUsSchema.parse(data);

module.exports = {
  contactUsSchema,
  parseContactUs,
};
