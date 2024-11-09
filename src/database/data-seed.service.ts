import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { GenresService } from '../genres/genres.service';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class DataSeedService implements OnApplicationBootstrap {
  constructor(
    private readonly genresService: GenresService,
    private readonly moviesService: MoviesService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedGenres();
    await this.seedMovies();
  }

  private async seedGenres() {
    const count = await this.genresService.findAll();
    if (count.length === 0) {
      await this.genresService.fetchAndSaveGenres();
      console.log('Genres have been seeded.');
    }
  }

  private async seedMovies() {
    const count = await this.moviesService.findAll();
    if (count.length === 0) {
      await this.moviesService.fetchAndSavePopularMovies(5); // Fetch first 5 pages
      console.log('Movies have been seeded.');
    }
  }
}
