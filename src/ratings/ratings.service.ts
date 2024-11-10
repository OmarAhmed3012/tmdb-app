import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rating, RatingDocument } from './schemas/rating.schema';
import { Model } from 'mongoose';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
  ) {}

  async rateMovie(
    userId: string,
    movieId: number,
    ratingValue: number,
  ): Promise<Rating> {
    const existingRating = await this.ratingModel
      .findOne({ userId, movieId })
      .exec();
    if (existingRating) {
      existingRating.rating = ratingValue;
      return existingRating.save();
    } else {
      const newRating = new this.ratingModel({
        userId,
        movieId,
        rating: ratingValue,
      });
      return newRating.save();
    }
  }

  async getAverageRating(movieId: number): Promise<number> {
    const result = await this.ratingModel.aggregate([
      { $match: { movieId } },
      { $group: { _id: '$movieId', avgRating: { $avg: '$rating' } } },
    ]);
    return result.length > 0 ? result[0].avgRating : 0;
  }
}
