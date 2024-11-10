import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async addToWatchlist(userId: string, movieId: number): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { watchlist: movieId } },
        { new: true },
      )
      .exec();
  }

  async markAsFavorite(userId: string, movieId: number): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: movieId } },
        { new: true },
      )
      .exec();
  }
}
