import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) { }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token);
      client.data.user = payload;

      const rooms = await this.chatService.getUserRooms(payload.sub);
      client.emit('roomsList', rooms);
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    const user = client.data.user;
    if (!user) return;

    await this.chatService.joinRoom(payload.roomId, user.sub);

    client.join(payload.roomId);

    const messages = await this.chatService.getRoomMessages(payload.roomId, user.sub);
    client.emit('history', { roomId: payload.roomId, messages });


    const rooms = await this.chatService.getUserRooms(user.sub);
    client.emit('roomsList', rooms);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { name: string; memberIds: string[]; historyAccess: boolean },
  ) {
    const user = client.data.user;
    const room = await this.chatService.createRoom(payload.name, user.sub, payload.memberIds, payload.historyAccess);
    client.emit('roomCreated', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    client.leave(payload.roomId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; content: string },
  ) {
    const user = client.data.user;
    const message = await this.chatService.createMessage(user.sub, payload.roomId, payload.content);
    this.server.to(payload.roomId).emit('newMessage', message);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; isTyping: boolean },
  ) {
    const user = client.data.user;
    client.broadcast.to(payload.roomId).emit('userTyping', {
      username: user.username,
      isTyping: payload.isTyping,
      userId: user.sub,
      roomId: payload.roomId
    });
  }

  @SubscribeMessage('addReaction')
  async handleReaction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageId: string; emoji: string; roomId: string },
  ) {
    const user = client.data.user;
    const result = await this.chatService.addReaction(user.sub, payload.messageId, payload.emoji);
    if (result.action === 'added') {
      this.server.to(payload.roomId).emit('reactionAdded', result.reaction);
    } else {
      this.server.to(payload.roomId).emit('reactionRemoved', {
        messageId: result.messageId,
        reactionId: result.reactionId,
        userId: result.userId,
        emoji: result.emoji
      });
    }
  }
  @SubscribeMessage('addMember')
  async handleAddMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; username: string; hasHistoryAccess: boolean },
  ) {
    try {
      const result = await this.chatService.addMember(payload.roomId, payload.username, payload.hasHistoryAccess);
      this.server.emit('addedToRoom', { room: result.member.room, userId: result.user.id });
      client.emit('memberAdded', { success: true });
    } catch (e) {
      client.emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('deleteRoom')
  async handleDeleteRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    const user = client.data.user;
    try {
      await this.chatService.deleteRoom(payload.roomId, user.sub);
      this.server.to(payload.roomId).emit('roomDeleted', { roomId: payload.roomId });
      this.server.in(payload.roomId).socketsLeave(payload.roomId);
    } catch (e) {
      client.emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('profileUpdated')
  async handleProfileUpdate(
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    this.server.emit('userUpdated', { userId: user.sub });
  }
}
