import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { TmdbModule } from '../tmdb/tmdb.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    TmdbModule,
  ],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [GenresService],
})
export class GenresModule {}
