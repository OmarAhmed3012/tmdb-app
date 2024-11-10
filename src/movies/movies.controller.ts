import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './schemas/movie.schema';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('genre') genre?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<Movie[]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.moviesService.findAllOptions({
      search,
      genre,
      page: pageNumber,
      limit: limitNumber,
    });
  }
}
