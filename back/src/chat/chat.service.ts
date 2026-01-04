import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(userId: string, roomId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
        authorId: userId,
        roomId,
        content,
      },
      include: { author: true },
    });
    return message;
  }

  async getRoomMessages(roomId: string, userId: string) {
    const member = await this.prisma.roomMember.findUnique({
      where: {
        userId_roomId: { userId, roomId },
      },
    });

    if (member && !member.hasHistoryAccess) {
       return this.prisma.message.findMany({
        where: {
          roomId,
          createdAt: { gt: member.joinedAt },
        },
        include: { author: true, reactions: { include: { user: true } } },
        orderBy: { createdAt: 'asc' },
      });
    }

    return this.prisma.message.findMany({
      where: { roomId },
      include: { author: true, reactions: { include: { user: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createRoom(name: string, ownerId: string, memberIds: string[], historyAccess: boolean = true) {
    return this.prisma.room.create({
      data: {
        name,
        ownerId,
        members: {
          create: [
             { userId: ownerId, hasHistoryAccess: true },
             ...memberIds.map(id => ({ userId: id, hasHistoryAccess: historyAccess }))
          ],
        },
      },
    });
  }
  
  async getUserRooms(userId: string) {
    const members = await this.prisma.roomMember.findMany({
      where: { userId },
      include: { room: true },
    });
    return members.map(m => m.room);
  }

  async addReaction(userId: string, messageId: string, emoji: string) {
    const message = await this.prisma.message.findUnique({
        where: { id: messageId },
    });
    
    if (!message) {
        throw new Error('Message not found');
    }
    
    if (message.authorId === userId) {
        throw new Error('You cannot react to your own message');
    }

    // Check for existing reaction
    const existingReaction = await this.prisma.reaction.findUnique({
        where: {
            userId_messageId_emoji: {
                userId,
                messageId,
                emoji
            }
        }
    });

    if (existingReaction) {
        await this.prisma.reaction.delete({
            where: { id: existingReaction.id }
        });
        return { action: 'removed', reactionId: existingReaction.id, messageId, userId, emoji };
    }

    const reaction = await this.prisma.reaction.create({
      data: { userId, messageId, emoji },
      include: { user: true },
    });
    
    return { action: 'added', reaction };
  }
  
  async joinRoom(roomId: string, userId: string) {
      // Special handling for 'general' room
      if (roomId === 'general') {
          const room = await this.prisma.room.findUnique({ where: { id: 'general' } });
          if (!room) {
              await this.prisma.room.create({
                  data: {
                      id: 'general',
                      name: 'General',
                      ownerId: userId,
                  },
              });
          }
      }

      // Check if already member
      const existing = await this.prisma.roomMember.findUnique({ where: { userId_roomId: {userId, roomId}}});
      if (existing) return existing;
      
      return this.prisma.roomMember.create({
          data: { roomId, userId, hasHistoryAccess: true } // Default true for now if just joining? or public?
      });
  }
  async addMember(roomId: string, username: string, hasHistoryAccess: boolean = true) {
    if (roomId === 'general') {
        throw new Error('Cannot add members to the General room manually');
    }
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
        throw new Error('User not found');
    }
    
    // Check if member already exists
    const existing = await this.prisma.roomMember.findUnique({
        where: { userId_roomId: { userId: user.id, roomId } }
    });
    
    if (existing) {
         throw new Error('User is already a member');
    }

    const member = await this.prisma.roomMember.create({
        data: {
            roomId,
            userId: user.id,
            hasHistoryAccess 
        },
        include: { room: true }
    });
    
    return { member, user };
  }
  async deleteRoom(roomId: string, userId: string) {
    if (roomId === 'general') {
        throw new Error('Cannot delete the General room');
    }

    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new Error('Room not found');
    
    if (room.ownerId !== userId) {
        throw new Error('Only the owner can delete this room');
    }

    // Manual cascade delete because schema might not have Cascade
    // 1. Delete all reactions in this room's messages
    const messages = await this.prisma.message.findMany({ 
        where: { roomId },
        select: { id: true }
    });
    const messageIds = messages.map(m => m.id);
    
    if (messageIds.length > 0) {
        await this.prisma.reaction.deleteMany({
            where: { messageId: { in: messageIds } }
        });
    }

    // 2. Delete all messages
    await this.prisma.message.deleteMany({ where: { roomId } });

    // 3. Delete all members
    await this.prisma.roomMember.deleteMany({ where: { roomId } });

    // 4. Delete the room
    return this.prisma.room.delete({ where: { id: roomId } });
  }

}
