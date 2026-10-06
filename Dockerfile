FROM node:20-alpine AS base

# Install production dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Production stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs myapp

# Copy dependencies from deps stage, then the app source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Winston writes to /app/logs, so the app user must own /app
RUN mkdir -p logs && chown -R myapp:nodejs /app

USER myapp

# Expose the application port (override with PORT env var)
EXPOSE 5005

# Health check (uses Node - no extra packages needed)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5005) + '/health', (r) => { r.resume(); process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
