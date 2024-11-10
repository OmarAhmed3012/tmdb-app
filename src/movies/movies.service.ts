import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { Genre, GenreDocument } from '../genres/schemas/genre.schema';
import { TmdbService } from '../tmdb/tmdb.service';
import { RatingsService } from 'src/ratings/ratings.service';

interface FindAllOptions {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
    private readonly ratingsService: RatingsService,
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

  async findAllOptions(options: FindAllOptions): Promise<any[]> {
    const { search, genre, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    if (genre) {
      const genreDoc = await this.genreModel.findOne({ name: genre }).exec();
      if (genreDoc) {
        query.genre_ids = genreDoc.id;
      } else {
        // If the genre doesn't exist, return an empty array
        return [];
      }
    }

    const movies = await this.movieModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // Include average ratings
    for (const movie of movies) {
      movie.averageRating = await this.ratingsService.getAverageRating(
        movie.id,
      );
    }

    return movies;
  }
}
