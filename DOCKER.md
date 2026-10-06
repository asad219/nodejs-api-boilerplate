# Docker Guide - MyApp API

How to build and publish the image, then run it with Docker Compose.

## 1. Build and push the image

From the project root:

```bash
docker build -t asad219/myapp-api:v1.0.0 .

# On Apple Silicon, build for the server's architecture
docker buildx build --platform linux/amd64 -t asad219/myapp-api:v1.0.0 --push .

docker login
docker push asad219/myapp-api:v1.0.0
```

When you release a new version, bump the tag here and in `docker-compose.yml`.

## 2. Prepare the server

```bash
ssh user@your-server-ip
mkdir -p ~/myapp-api && cd ~/myapp-api
```

Copy `docker-compose.yml` to `~/myapp-api`.

### Create `.env`

The `.env` file is never baked into the image. Create it on the server from `.env.example`, or copy it securely:

```bash
scp .env user@your-server-ip:~/myapp-api/.env
```

At minimum, set `CONNECTION_STRING`, `JWT_SECRET`, `NODE_ENV=production` and `ALLOWED_ORIGINS`.

## 3. Deploy

```bash
docker compose pull
docker compose up -d
docker compose logs -f
```

The API listens on `PORT` (default `5005`). In production, put it behind a reverse proxy or load balancer that terminates HTTPS (nginx, Caddy, or your cloud provider's load balancer) rather than exposing the port directly.

## 4. Verify

```bash
curl http://localhost:5005/health        # expect {"status":"healthy",...}
docker inspect --format '{{.State.Health.Status}}' myapp-api   # expect healthy
```

## Updating to a new version

```bash
# Edit the image tag in docker-compose.yml, then:
docker compose pull myapp-api
docker compose up -d myapp-api
```

## Useful commands

```bash
docker compose ps
docker compose logs -f myapp-api
docker compose restart myapp-api
docker compose down
```

## Troubleshooting

| Issue                    | Solution                                                            |
| ------------------------ | ------------------------------------------------------------------- |
| Container exits on start | `CONNECTION_STRING` or `JWT_SECRET` missing, or MongoDB unreachable |
| Health check failing     | Database not connected: `docker compose logs myapp-api`             |
| Port already in use      | Change `PORT` in `.env` or stop the process using it                |

## Security notes

- Never commit `.env` or include it in the image (`.dockerignore` excludes it).
- Use long random values for all JWT secrets in production.
- Keep MongoDB off the public internet (private network, VPN or Atlas IP allowlist).
