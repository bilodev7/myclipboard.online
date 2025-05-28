# Shared Clipboard

An open-source real-time shared clipboard application that allows users to create and join clipboard rooms to share text content and files seamlessly.

## Features

- Create new clipboard rooms with optional password protection
- Join existing clipboard rooms with a room code
- Real-time updates of clipboard contents for all connected users
- Upload and share files within clipboard rooms
- Download shared files with a single click
- Copy individual text entries with one click
- Delete entries and files
- See how many users are connected to a clipboard
- Automatic clipboard expiration after 24 hours of inactivity
- Responsive design for mobile and desktop

## Tech Stack

- **Monorepo**: pnpm workspace
- **Frontend**: Next.js with TypeScript, Tailwind CSS
- **Backend**: NestJS with TypeScript
- **Database**: Redis
- **File Storage**: MinIO (S3-compatible object storage)
- **Real-time Communication**: Socket.IO
- **Containerization**: Docker & Docker Compose

## Prerequisites

### For Local Development
- Node.js (v16 or later)
- pnpm (v7 or later)
- Redis server

### For Containerized Deployment
- Docker
- Docker Compose

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies
```bash
pnpm install
```

3. Start Redis server
```bash
# If you have Redis installed locally
redis-server

# Or use Docker
docker run -p 6379:6379 redis
```

4. Start the development servers
```bash
# Start both frontend and backend
pnpm dev

# Or start them separately
pnpm --filter=frontend dev
pnpm --filter=backend dev
```

5. Open your browser and navigate to `http://localhost:3000`

### Using Docker Compose

1. Clone the repository
2. Build and start the containers
```bash
docker-compose up -d
```

3. Open your browser and navigate to `http://localhost:3000`

The containerized setup includes:
- Frontend on port 3000
- Backend on port 3001
- Redis on port 6379 (internal)
- MinIO on ports 9000 (API) and 9001 (Console)

## Project Structure

```
shared-clipboard/
├── apps/
│   ├── frontend/     # Next.js frontend application
│   └── backend/      # NestJS backend application
├── docker-compose.yml
└── package.json
```

## Environment Variables

### Frontend

Create a `.env.local` file in the `packages/frontend` directory:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Backend

Create a `.env` file in the `apps/backend` directory:

```
PORT=3001
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=your_redis_password  # Uncomment and set if needed

# MinIO Configuration (for file storage)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

## Deployment

### Using Docker (Recommended)

The entire application stack can be deployed using Docker Compose:

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

For production deployment, you may want to customize the `docker-compose.yml` file to use persistent volumes for Redis and MinIO data.

### Manual Deployment

#### Frontend

The Next.js frontend can be deployed to platforms like Vercel or Netlify.

#### Backend

The NestJS backend can be deployed to platforms like Heroku, AWS, or DigitalOcean.

#### Redis and MinIO

For production, it's recommended to use managed services:
- Redis: Redis Labs, AWS ElastiCache, or DigitalOcean Managed Databases
- File Storage: AWS S3, DigitalOcean Spaces, or self-hosted MinIO on a server

## File Upload Limits

By default, the application limits file uploads to 10MB per file. This can be configured in the following locations:

- Backend: `src/file/file.controller.ts` - Modify the `MaxFileSizeValidator` value
- Frontend: `src/app/[roomCode]/components/FileUploadComponent.tsx` - Update the file size validation check

## License

ISC
