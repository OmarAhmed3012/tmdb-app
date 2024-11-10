import { Controller, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body('username') username: string) {
    return this.usersService.create({ username } as User);
  }

  @Post(':userId/watchlist/:movieId')
  async addToWatchlist(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ) {
    return this.usersService.addToWatchlist(userId, parseInt(movieId, 10));
  }

  @Post(':userId/favorites/:movieId')
  async markAsFavorite(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ) {
    return this.usersService.markAsFavorite(userId, parseInt(movieId, 10));
  }
}
