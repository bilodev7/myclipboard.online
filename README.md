# Shared Clipboard

A real-time shared clipboard application that allows users to create and join clipboard rooms to share text content seamlessly.

## Features

- Create new clipboard rooms with optional password protection
- Join existing clipboard rooms with a room code
- Real-time updates of clipboard contents for all connected users
- Copy individual entries with one click
- Delete entries
- See how many users are connected to a clipboard
- Automatic clipboard expiration after 24 hours of inactivity
- Responsive design for mobile and desktop

## Tech Stack

- **Monorepo**: pnpm workspace
- **Frontend**: Next.js with TypeScript, Tailwind CSS
- **Backend**: NestJS with TypeScript
- **Database**: Redis
- **Real-time Communication**: Socket.IO

## Prerequisites

- Node.js (v16 or later)
- pnpm (v7 or later)
- Redis server

## Getting Started

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

## Project Structure

```
shared-clipboard/
├── packages/
│   ├── frontend/     # Next.js frontend application
│   └── backend/      # NestJS backend application
├── pnpm-workspace.yaml
└── package.json
```

## Environment Variables

### Frontend

Create a `.env.local` file in the `packages/frontend` directory:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Backend

Create a `.env` file in the `packages/backend` directory:

```
PORT=3001
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=your_redis_password  # Uncomment and set if needed
```

## Deployment

### Frontend

The Next.js frontend can be deployed to platforms like Vercel or Netlify.

### Backend

The NestJS backend can be deployed to platforms like Heroku, AWS, or DigitalOcean.

### Redis

For production, it's recommended to use a managed Redis service like Redis Labs, AWS ElastiCache, or DigitalOcean Managed Databases.

## License

ISC
