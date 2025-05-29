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
import { FileEntry } from '../file/file.service';

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
  namespace: '/socket.io',
})
export class ClipboardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ClipboardGateway.name);
  private roomUserCount: RoomUserCount = {};

  @WebSocketServer()
  server: Server;

  constructor(private readonly clipboardService: ClipboardService) { }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    const { roomCode } = client.handshake.query;

    if (!roomCode || typeof roomCode !== 'string') {
      this.logger.warn(`Client ${client.id} connected without a valid room code.`);
      client.emit('error', { message: 'Room code is required.' });
      client.disconnect();
      return;
    }

    // Check if clipboard exists
    const exists = await this.clipboardService.clipboardExists(roomCode);

    if (!exists) {
      this.logger.warn(`Client ${client.id} attempted to connect to non-existent room: ${roomCode}.`);
      client.emit('error', { message: `Clipboard room ${roomCode} does not exist.` });
      client.disconnect();
      return;
    }

    this.logger.log(`Client connected: ${client.id} to room ${roomCode}`);
    // Client will join the room upon receiving 'joinRoom' message from frontend
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
    this.logger.log(`Attempting to join room: ${roomCode}, ClientID: ${clientId}, SocketID: ${client.id}`);

    // Ensure client is connecting to the room specified in handshake
    const handshakeRoomCode = client.handshake.query.roomCode;
    if (handshakeRoomCode !== roomCode) {
      this.logger.warn(`Client ${client.id} (clientId: ${clientId}) room mismatch. Handshake: ${handshakeRoomCode}, JoinRequest: ${roomCode}.`);
      client.emit('error', { message: 'Room code mismatch. Please refresh.' });
      client.disconnect(); // Disconnecting on critical mismatch
      return;
    }

    this.logger.log(`Fetching clipboard for room ${roomCode}, ClientID: ${clientId}`);
    const clipboard = await this.clipboardService.getClipboard(roomCode);

    if (!clipboard) {
      this.logger.warn(`Clipboard ${roomCode} not found for ClientID: ${clientId} during joinRoom.`);
      client.emit('error', { message: `Clipboard ${roomCode} not found or has expired.` });
      // Not disconnecting, client might go home or retry based on this error.
      return;
    }

    this.logger.log(`Successfully fetched clipboard for room ${roomCode}, ClientID: ${clientId}. Joining socket to room.`);
    client.join(roomCode);

    if (!this.roomUserCount[roomCode]) {
      this.roomUserCount[roomCode] = 0;
    }
    this.roomUserCount[roomCode]++;
    this.logger.log(`User count for room ${roomCode} is now ${this.roomUserCount[roomCode]}.`);

    const expiresIn = await this.clipboardService.getExpirationTime(roomCode);
    this.logger.log(`Expiration for room ${roomCode} is ${expiresIn}. Emitting clipboardData to ClientID: ${clientId}.`);

    client.emit('clipboardData', {
      entries: clipboard.entries,
      files: clipboard.files || [], // Include files array
      connectedUsers: this.roomUserCount[roomCode],
      expiresIn,
    });

    this.logger.log(`Emitting userCount to room ${roomCode}.`);
    this.server.to(roomCode).emit('userCount', this.roomUserCount[roomCode]);

    this.logger.log(`Client ${clientId} (SocketID: ${client.id}) successfully joined room ${roomCode}`);
  }

  @SubscribeMessage('addEntry')
  async handleAddEntry(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; content: string; clientId: string },
  ) {
    const { roomCode, content, clientId } = data;

    // Verify client is in the correct room
    if (!client.rooms.has(roomCode)) {
      this.logger.warn(`Client ${client.id} (clientId: ${clientId}) attempted to add entry to ${roomCode} without being in it.`);
      client.emit('error', { message: 'Not authorized for this room.' });
      return;
    }

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

    // Verify client is in the correct room
    if (!client.rooms.has(roomCode)) {
      this.logger.warn(`Client ${client.id} (clientId: ${clientId}) attempted to delete entry from ${roomCode} without being in it.`);
      client.emit('error', { message: 'Not authorized for this room.' });
      return;
    }

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

    // Verify client is in the correct room
    if (!client.rooms.has(roomCode)) {
      this.logger.warn(`Client ${client.id} (clientId: ${clientId}) attempted to clear clipboard ${roomCode} without being in it.`);
      client.emit('error', { message: 'Not authorized for this room.' });
      return;
    }

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

  @SubscribeMessage('fileUploaded')
  async handleFileUploaded(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; fileEntry: FileEntry; clientId: string },
  ) {
    const { roomCode, fileEntry, clientId } = data;

    // Verify client is in the correct room
    if (!client.rooms.has(roomCode)) {
      this.logger.warn(`Client ${client.id} (clientId: ${clientId}) attempted to notify about file upload in ${roomCode} without being in it.`);
      client.emit('error', { message: 'Not authorized for this room.' });
      return;
    }

    // Broadcast file upload to all clients in the room
    this.server.to(roomCode).emit('fileUploaded', fileEntry);

    // Refresh expiration
    await this.clipboardService.refreshExpiration(roomCode);

    this.logger.log(`File ${fileEntry.id} uploaded to room ${roomCode}`);
  }

  @SubscribeMessage('deleteFile')
  async handleDeleteFile(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; fileId: string; clientId: string },
  ) {
    const { roomCode, fileId, clientId } = data;

    // Verify client is in the correct room
    if (!client.rooms.has(roomCode)) {
      this.logger.warn(`Client ${client.id} (clientId: ${clientId}) attempted to delete file from ${roomCode} without being in it.`);
      client.emit('error', { message: 'Not authorized for this room.' });
      return;
    }

    // Broadcast file deletion to all clients in the room
    this.server.to(roomCode).emit('fileDeleted', fileId);

    this.logger.log(`File ${fileId} deleted from room ${roomCode}`);
  }
}
