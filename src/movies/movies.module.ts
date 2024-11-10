import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { Genre, GenreSchema } from '../genres/schemas/genre.schema';
import { RatingsModule } from '../ratings/ratings.module';
import { TmdbModule } from 'src/tmdb/tmdb.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: Genre.name, schema: GenreSchema },
    ]),
    RatingsModule,
    TmdbModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
