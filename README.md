# MyClipboard.online

<p align="center">
  <img src="https://myclipboard.online/logo.png" alt="MyClipboard.online Logo" width="200">
</p>

A real-time shared clipboard application that allows users to easily share text snippets and files across devices and with others.

## 🚀 Features

- **Real-time Synchronization**: All clipboard entries are instantly synced across all connected devices
- **Room-based Sharing**: Create or join rooms with simple 4-character codes
- **Password Protection**: Optionally secure your clipboard rooms with passwords
- **File Sharing**: Upload and share files up to 10MB in size
- **Expiration**: Clipboards automatically expire after 24 hours of inactivity
- **User-friendly Interface**: Clean, responsive design that works on all devices
- **No Registration Required**: Start sharing instantly without creating an account

## 🔧 Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: NestJS, Socket.IO, TypeScript
- **Database**: Redis for fast, in-memory data storage
- **Deployment**: Docker, Nginx

## 🏗️ Architecture

The application follows a microservices architecture with two main components:

1. **Frontend (Next.js)**
   - Server-side rendered React application
   - Real-time updates via Socket.IO
   - Responsive design with TailwindCSS

2. **Backend (NestJS)**
   - RESTful API for clipboard operations
   - WebSocket server for real-time communication
   - File upload and management
   - Redis integration for data persistence

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18+)
- pnpm
- Redis
- Docker and Docker Compose (optional)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shared-clipboard.git
   cd shared-clipboard
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd apps/frontend
   pnpm install

   # Install backend dependencies
   cd ../backend
   pnpm install
   ```

3. Start Redis:
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:alpine
   ```

4. Start the backend:
   ```bash
   cd apps/backend
   pnpm start
   ```

5. Start the frontend:
   ```bash
   cd apps/frontend
   pnpm dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

### Using Docker Compose

For a complete development environment:

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up
```

## 🚢 Deployment

The application is deployed using Docker Compose and Nginx as a reverse proxy.

1. Configure your environment variables in `docker-compose.prod.yml`
2. Update the Nginx configuration in `nginx.conf`
3. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

## 📝 API Documentation

### REST API Endpoints

- `POST /api/clipboard` - Create a new clipboard
- `GET /api/clipboard/:roomCode` - Get clipboard by room code
- `GET /api/clipboard/:roomCode/exists` - Check if clipboard exists
- `POST /api/clipboard/:roomCode/verify` - Verify clipboard password
- `POST /api/file/:roomCode` - Upload a file to a clipboard
- `GET /api/file/:roomCode/:fileId` - Download a file
- `DELETE /api/file/:roomCode/:fileId` - Delete a file

### WebSocket Events

- `joinRoom` - Join a clipboard room
- `leaveRoom` - Leave a clipboard room
- `addEntry` - Add a new clipboard entry
- `entryAdded` - New entry added notification
- `deleteEntry` - Delete a clipboard entry
- `entryDeleted` - Entry deleted notification
- `clearClipboard` - Clear all entries
- `clipboardCleared` - Clipboard cleared notification
- `fileUploaded` - File uploaded notification
- `deleteFile` - Delete a file
- `fileDeleted` - File deleted notification

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

Project Link: [https://github.com/yourusername/shared-clipboard](https://github.com/yourusername/shared-clipboard)

Live Demo: [https://myclipboard.online](https://myclipboard.online)