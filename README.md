# MyClipboard.online

<p>
  <img src="https://myclipboard.online/logo.png" alt="MyClipboard.online Logo" width="100">
</p>

A real-time shared clipboard application that allows users to easily share text snippets and files across devices.

**Live Demo**: [https://myclipboard.online](https://myclipboard.online)

## 🚀 Features

- **Real-time Synchronization**: All clipboard entries are instantly synced across all connected devices
- **Room-based Sharing**: Create or join rooms with simple 4-character codes
- **Password Protection**: Optionally secure your clipboard rooms with passwords
- **File Sharing**: Upload and share files up to 10MB in size
- **Expiration**: Clipboards automatically expire after 24 hours of inactivity
- **User-friendly Interface**: Clean, responsive design that works on all devices
- **No Registration Required**: Start sharing instantly without creating an account

## 🚀 Installation

Currently only docker is supported.

- Clone the repository
```bash
git clone git@github.com:bilodev7/myclipboard.online.git

cd myclipboard.online
```

- Start Development Server
```bash
docker compose up
```

- Start Production Server
```bash
docker compose -f docker-compose.prod.yml up
```