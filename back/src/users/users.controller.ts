import { Controller, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { username?: string; color?: string }, @Request() req) {
      if (req.user.id !== id) {
          const { ForbiddenException } = require('@nestjs/common');
          throw new ForbiddenException('You can only update your own profile');
      }
      return this.usersService.update(id, body);
  }
}
