import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { TmdbService } from '../tmdb/tmdb.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private readonly tmdbService: TmdbService,
  ) {}

  async fetchAndSavePopularMovies(pages = 1): Promise<Movie[]> {
    const movies = [];

    for (let page = 1; page <= pages; page++) {
      const data = await this.tmdbService.getPopularMovies(page);
      movies.push(...data.results);
    }

    try {
      const insertedMovies = await this.movieModel.insertMany(movies, {
        ordered: false,
      });
      // Convert inserted documents to plain objects
      const plainMovies = insertedMovies.map((doc) => doc.toObject());
      return plainMovies;
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        console.log('Some movies already exist in the database.');
        // Fetch existing movies as plain objects
        const existingMovies = await this.movieModel.find().lean().exec();
        return existingMovies;
      } else {
        throw error;
      }
    }
  }

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }
}
