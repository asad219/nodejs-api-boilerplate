const { z } = require('zod');

// MongoDB ObjectId as a 24-hex string
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
});

const parsePagination = (query) => paginationSchema.parse(query);

module.exports = {
  objectId,
  paginationSchema,
  parsePagination,
};
