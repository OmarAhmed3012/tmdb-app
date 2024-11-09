import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from './schemas/genre.schema';
import { TmdbService } from '../tmdb/tmdb.service';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
    private readonly tmdbService: TmdbService,
  ) {}

  async fetchAndSaveGenres(): Promise<Genre[]> {
    const { genres } = await this.tmdbService.getMovieGenres();
    try {
      const insertedGenres = await this.genreModel.insertMany(genres, {
        ordered: false,
      });
      // Convert inserted documents to plain objects
      const plainGenres = insertedGenres.map((doc) => doc.toObject());
      return plainGenres;
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        console.log('Genres already exist in the database.');
        // Fetch existing genres as plain objects
        const existingGenres = await this.genreModel.find().lean().exec();
        return existingGenres;
      } else {
        throw error;
      }
    }
  }

  async findAll(): Promise<Genre[]> {
    return this.genreModel.find().exec();
  }
}
