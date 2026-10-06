# MyApp API

REST API boilerplate for **MyApp**, built with Node.js 20, Express 4 and MongoDB (Mongoose 9). Plain JavaScript (CommonJS), flat layer-based structure.

- Auth: JWT access tokens, bcrypt password hashing, token revocation on logout
- Validation: Zod 4
- Security: helmet, cors, express-mongo-sanitize, xss-clean, express-rate-limit
- Logging: winston (files + console in dev) with morgan HTTP logs
- Docs: Swagger UI at `/api-docs`
- Email: Resend (disabled unless `EMAIL_ENABLED=true`)
- Deployment: Docker and Docker Compose (see [DOCKER.md](DOCKER.md))

Repository: [github.com/asad219/nodejs-api-boilerplate](https://github.com/asad219/nodejs-api-boilerplate)

## Creating a new project from this boilerplate

### 1. Copy the boilerplate

Clone it into a new folder and start a fresh git history:

```bash
git clone --depth 1 https://github.com/asad219/nodejs-api-boilerplate.git my-new-api
cd my-new-api
rm -rf .git
git init
```

Or copy a local checkout, skipping installed and generated files:

```bash
rsync -a --exclude node_modules --exclude logs --exclude .env --exclude .git nodejs-api-boilerplate/ my-new-api/
cd my-new-api
git init
```

### 2. Rename the project

Replace the `MyApp` / `myapp` placeholders with your project's name. List every occurrence with:

```bash
grep -rniE "myapp|asad219" . --exclude-dir=node_modules --exclude-dir=logs --exclude=package-lock.json
```

| File                            | What to change                                                       |
| ------------------------------- | -------------------------------------------------------------------- |
| `package.json`                  | `name`, `description`, `author`, and reset `version` to `1.0.0`      |
| `README.md`, `DOCKER.md`        | Title, project name, image name and server paths                     |
| `config/swaggerConfig.js`       | API title, description and production server URL                     |
| `config/logger.js`              | `service` name in log entries                                        |
| `config/index.js`               | Default email sender address and name                                |
| `server.js`                     | Startup log message                                                  |
| `.env.example`                  | Database name, CORS origins, email addresses and `APP_URL`           |
| `docker-compose.yml`            | Service name, `container_name` and image (`<dockerhub-user>/<name>`) |
| `Dockerfile`                    | Non-root user name (optional)                                        |
| `docs/contactRoutes.swagger.js` | Example subject text                                                 |

Then regenerate `package-lock.json` so it picks up the new package name:

```bash
rm package-lock.json
npm install
```

### 3. Configure the environment

```bash
cp .env.example .env
```

Set at least `CONNECTION_STRING` (with your own database name) and `JWT_SECRET` (generate one with `openssl rand -hex 32`). Set `EMAIL_ENABLED=true` and the Resend variables only when you're ready to send emails.

### 4. Replace the sample `Note` resource

`Note` is only an example. Once you've used it as a template for your first resource (see [Adding a new resource](#adding-a-new-resource)), delete it:

```bash
rm models/noteModel.js validators/note.zod.js controllers/noteController.js \
   routes/noteRoutes.js docs/noteRoutes.swagger.js
```

Remove the `noteRoutes` import and the `/notes` mount from `routes/index.js`, remove the `/notes` rows from the endpoints table below, and run `npm run db:schema` to refresh `docs/db-schema.json`.

### 5. Run it and make the first commit

```bash
npm run dev            # check http://localhost:5005/health and /api-docs
npm run lint
git add .
git commit -m "Initial commit from boilerplate"
git remote add origin <your-new-repo-url>
git push -u origin main
```

## Getting started

Requirements: Node.js 20+ and a MongoDB instance (local or Atlas).

```bash
npm install
cp .env.example .env   # then edit CONNECTION_STRING and JWT_SECRET
npm run dev
```

- API base URL: `http://localhost:5005/api/v1`
- Health check: `http://localhost:5005/health`
- Swagger UI: `http://localhost:5005/api-docs`

## Scripts

| Script              | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `npm start`         | Start the server with Node                                |
| `npm run dev`       | Start with nodemon (auto-reload)                          |
| `npm run lint`      | Run ESLint                                                |
| `npm run format`    | Format all files with Prettier                            |
| `npm run db:schema` | Regenerate `docs/db-schema.json` from the Mongoose models |

## Environment variables

See `.env.example` for the full list. `CONNECTION_STRING` and `JWT_SECRET` are required; the server exits on startup if either is missing. All settings are read through `config/index.js`; don't read `process.env` anywhere else.

| Variable                                                      | Default                 | Description                                 |
| ------------------------------------------------------------- | ----------------------- | ------------------------------------------- |
| `CONNECTION_STRING`                                           | (required)              | MongoDB connection string                   |
| `JWT_SECRET`                                                  | (required)              | Secret for access tokens                    |
| `JWT_EXPIRES_IN`                                              | `24h`                   | Access token lifetime                       |
| `JWT_VERIFIED_SECRET` / `JWT_VERIFIED_EXPIRES_IN`             | `JWT_SECRET` / `15m`    | Email verification token                    |
| `JWT_RESET_PASSWORD_SECRET` / `JWT_RESET_PASSWORD_EXPIRES_IN` | `JWT_SECRET` / `3m`     | Password reset token                        |
| `PORT`                                                        | `5005`                  | HTTP port                                   |
| `NODE_ENV`                                                    | `development`           | `production` disables console logging       |
| `ALLOWED_ORIGINS`                                             | `http://localhost:3000` | Comma-separated CORS origins                |
| `BCRYPT_ROUNDS`                                               | `10`                    | bcrypt cost factor                          |
| `MAX_LOGIN_ATTEMPTS`                                          | `5`                     | Reserved for login lockout logic            |
| `DNS_SERVERS`                                                 | `1.1.1.1,8.8.8.8`       | DNS resolvers used for MongoDB SRV lookups  |
| `EMAIL_ENABLED`                                               | `false`                 | Set to `true` to send emails through Resend |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME`             |                         | Resend credentials and sender               |
| `EMAIL_CONTACT_TO`                                            | `EMAIL_FROM`            | Inbox that receives contact form messages   |
| `COMPANY_LOGO_URL`, `APP_URL`                                 |                         | Used in email templates                     |

## Folder structure

```
server.js              # app bootstrap and middleware order
config/                # env config, DB connection, logger, swagger options
controllers/           # <resource>Controller.js - request handlers (asyncHandler)
models/                # <resource>Model.js - Mongoose schemas (named exports)
routes/                # <resource>Routes.js + index.js (central router) + healthRoutes.js
validators/            # <resource>.zod.js - Zod schemas and parse helpers
middleware/            # auth, admin, ownership, rate limit, ObjectId and error handling
services/              # external integrations (emailService.js)
utils/                 # constants, token revocation, OTP helpers, email templates, date utils
docs/                  # <resource>Routes.swagger.js (JSDoc @swagger blocks) + db-schema.json
scripts/               # generateDbSchema.js
logs/                  # winston output (gitignored)
```

## Included endpoints

All resource routes are under `/api/v1`.

| Method | Path                                | Access                |
| ------ | ----------------------------------- | --------------------- |
| GET    | `/health`                           | Public                |
| POST   | `/users/register`                   | Public (rate limited) |
| POST   | `/users/login`                      | Public (rate limited) |
| POST   | `/users/logout`                     | Authenticated         |
| POST   | `/users/send-reset-password-code`   | Public (rate limited) |
| POST   | `/users/verify-reset-password-code` | Public (rate limited) |
| POST   | `/users/update-password`            | Public (rate limited) |
| GET    | `/users/:userId`                    | Owner or admin        |
| PUT    | `/users/update/:userId`             | Owner or admin        |
| POST   | `/contact`                          | Public (rate limited) |
| POST   | `/notes`                            | Authenticated         |
| GET    | `/notes?page=1&limit=10`            | Admin                 |
| GET    | `/notes/user/:userId`               | Owner or admin        |
| PUT    | `/notes/:noteId`                    | Owner or admin        |
| DELETE | `/notes/:noteId`                    | Owner or admin        |

`Note` is the sample resource that shows the full pattern end to end. Rename or delete it when you start building real features.

### Password reset flow

1. `POST /users/send-reset-password-code` with `{ email }` emails a 6-digit code and returns a short-lived `token`.
2. (Optional) `POST /users/verify-reset-password-code` with `{ token, code }` returns `{ verified }` so the client can move to the "new password" screen.
3. `POST /users/update-password` with `{ email, password, token, code }` sets the new password and revokes the token.

The token only contains a keyed hash of the code, so the code cannot be read from the token itself.

### Token types

Every JWT carries an `aud` claim (`access`, `email-verification` or `reset-password`). `validateToken` only accepts `access` tokens, so reset and verification tokens can't be used to call protected endpoints even when they share `JWT_SECRET`.

## Conventions

### Errors

Controllers are wrapped in `asyncHandler`. To return an error, set the status and throw:

```js
res.status(404);
throw new Error('User not found');
```

`middleware/errorHandler.js` logs the error and responds with `{ title, message }`. Zod errors are turned into a 400 with all issue messages joined.

### Route middleware order

`authLimiter` (public/auth routes) -> `validateObjectId` -> `validateToken` -> `requireAdmin` | `requireOwnership()` -> controller.

`validateObjectId` checks every route param, so only use it on routes whose params are all ObjectIds.

### Response shapes

- Create: `201 { success: true, message: '<X> created successfully', <resource>: saved }`
- Get / list: `200 { success: true, <resource>s }`
- Admin paginated list: `200 { success: true, <resource>s, pagination: { page, limit, total, pages } }`

## Adding a new resource

1. `models/<resource>Model.js`: schema with `timestamps`, `id` virtual, `toJSON` virtuals, named export.
2. `validators/<resource>.zod.js`: `<resource>CreateSchema`, `<resource>UpdateSchema`, `parse<Resource>Create`, `parse<Resource>Update`.
3. `controllers/<resource>Controller.js`: handlers wrapped in `asyncHandler`, validate first, then do the DB work.
4. `routes/<resource>Routes.js`: one `// METHOD /api/v1/...` comment per route; follow the middleware order above.
5. Mount it in `routes/index.js` with a `// Mount <x> routes` comment and a kebab-case path.
6. `docs/<resource>Routes.swagger.js`: `components.schemas` first, then one `@swagger` block per path.
7. `npm run db:schema` to refresh `docs/db-schema.json`.

Use the `Note` files (`noteModel.js`, `note.zod.js`, `noteController.js`, `noteRoutes.js`, `noteRoutes.swagger.js`) as the template.
