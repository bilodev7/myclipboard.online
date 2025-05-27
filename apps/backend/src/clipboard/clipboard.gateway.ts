import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ClipboardService, ClipboardEntry } from './clipboard.service';

interface RoomUserCount {
  [roomCode: string]: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  namespace: '/',
})
export class ClipboardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ClipboardGateway.name);
  private roomUserCount: RoomUserCount = {};

  @WebSocketServer()
  server: Server;

  constructor(private readonly clipboardService: ClipboardService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    const { roomCode, isCreating } = client.handshake.query;
    
    if (!roomCode || typeof roomCode !== 'string') {
      this.logger.error('No room code provided');
      client.disconnect();
      return;
    }

    // Check if clipboard exists
    let exists = await this.clipboardService.clipboardExists(roomCode);
    
    // If the client is creating a new clipboard and it doesn't exist, create it
    if (!exists && isCreating === 'true') {
      try {
        // Create a new clipboard with the provided room code
        await this.clipboardService.createClipboardWithCode(roomCode);
        exists = true;
        this.logger.log(`Created new clipboard with code: ${roomCode}`);
      } catch (error) {
        this.logger.error(`Failed to create clipboard ${roomCode}`, error);
        client.disconnect();
        return;
      }
    } else if (!exists) {
      this.logger.error(`Clipboard ${roomCode} does not exist`);
      client.disconnect();
      return;
    }

    this.logger.log(`Client connected: ${client.id} to room ${roomCode}`);
  }

  async handleDisconnect(client: Socket) {
    const { roomCode } = client.handshake.query;
    
    if (roomCode && typeof roomCode === 'string') {
      // Remove client from room
      client.leave(roomCode);
      
      // Update user count
      if (this.roomUserCount[roomCode]) {
        this.roomUserCount[roomCode]--;
        
        // Broadcast updated user count
        this.server.to(roomCode).emit('userCount', this.roomUserCount[roomCode]);
      }
      
      this.logger.log(`Client disconnected: ${client.id} from room ${roomCode}`);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; clientId: string },
  ) {
    const { roomCode, clientId } = data;
    
    // Join the room
    client.join(roomCode);
    
    // Update user count
    if (!this.roomUserCount[roomCode]) {
      this.roomUserCount[roomCode] = 0;
    }
    this.roomUserCount[roomCode]++;
    
    // Get clipboard data
    const clipboard = await this.clipboardService.getClipboard(roomCode);
    
    if (!clipboard) {
      client.emit('error', { message: 'Clipboard not found' });
      return;
    }
    
    // Get expiration time
    const expiresIn = await this.clipboardService.getExpirationTime(roomCode);
    
    // Send clipboard data to client
    client.emit('clipboardData', {
      entries: clipboard.entries,
      connectedUsers: this.roomUserCount[roomCode],
      expiresIn,
    });
    
    // Broadcast updated user count to all clients in the room
    this.server.to(roomCode).emit('userCount', this.roomUserCount[roomCode]);
    
    this.logger.log(`Client ${clientId} joined room ${roomCode}`);
  }

  @SubscribeMessage('addEntry')
  async handleAddEntry(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; content: string; clientId: string },
  ) {
    const { roomCode, content, clientId } = data;
    
    this.logger.log(`Adding entry to room ${roomCode} from client ${clientId}`);
    
    // Get all sockets in the room to verify room membership
    const socketsInRoom = await this.server.in(roomCode).fetchSockets();
    this.logger.log(`Number of clients in room ${roomCode}: ${socketsInRoom.length}`);
    
    // Add entry to clipboard
    const entry = await this.clipboardService.addEntry(roomCode, content, clientId);
    
    if (!entry) {
      this.logger.error(`Failed to add entry to room ${roomCode}`);
      client.emit('error', { message: 'Failed to add entry' });
      return;
    }
    
    // Broadcast new entry to all clients in the room
    this.logger.log(`Broadcasting new entry to room ${roomCode}`);
    this.server.to(roomCode).emit('newEntry', entry);
    
    // Refresh expiration
    await this.clipboardService.refreshExpiration(roomCode);
    
    // Update expiration time
    const expiresIn = await this.clipboardService.getExpirationTime(roomCode);
    this.server.to(roomCode).emit('expirationUpdate', expiresIn);
    
    this.logger.log(`New entry added to room ${roomCode}`);
  }

  @SubscribeMessage('deleteEntry')
  async handleDeleteEntry(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; entryId: string; clientId: string },
  ) {
    const { roomCode, entryId, clientId } = data;
    
    // Delete entry from clipboard
    const success = await this.clipboardService.deleteEntry(roomCode, entryId);
    
    if (!success) {
      client.emit('error', { message: 'Failed to delete entry' });
      return;
    }
    
    // Broadcast deleted entry to all clients in the room
    this.server.to(roomCode).emit('deleteEntry', entryId);
    
    // Refresh expiration
    await this.clipboardService.refreshExpiration(roomCode);
    
    this.logger.log(`Entry ${entryId} deleted from room ${roomCode}`);
  }

  @SubscribeMessage('clearClipboard')
  async handleClearClipboard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; clientId: string },
  ) {
    const { roomCode, clientId } = data;
    
    // Clear clipboard
    const success = await this.clipboardService.clearClipboard(roomCode);
    
    if (!success) {
      client.emit('error', { message: 'Failed to clear clipboard' });
      return;
    }
    
    // Broadcast clear event to all clients in the room
    this.server.to(roomCode).emit('clipboardData', {
      entries: [],
      connectedUsers: this.roomUserCount[roomCode],
    });
    
    // Refresh expiration
    await this.clipboardService.refreshExpiration(roomCode);
    
    this.logger.log(`Clipboard ${roomCode} cleared by ${clientId}`);
  }
}
