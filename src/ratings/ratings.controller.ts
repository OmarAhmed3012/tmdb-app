import { Controller, Post, Body, Param } from '@nestjs/common';
import { RatingsService } from './ratings.service';

@Controller('movies/:movieId/rate')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  async rateMovie(
    @Param('movieId') movieId: string,
    @Body('userId') userId: string,
    @Body('rating') ratingValue: number,
  ) {
    return this.ratingsService.rateMovie(
      userId,
      parseInt(movieId, 10),
      ratingValue,
    );
  }
}
