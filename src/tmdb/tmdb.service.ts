import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TmdbService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.themoviedb.org/3';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY');
  }

  private async fetchFromTMDB<T>(endpoint: string, params?: any): Promise<T> {
    const response = await lastValueFrom(
      this.httpService.get<T>(`${this.apiUrl}${endpoint}`, {
        params: {
          api_key: this.apiKey,
          ...params,
        },
      }),
    );
    return response.data;
  }

  async getPopularMovies(page = 1): Promise<any> {
    return this.fetchFromTMDB('/movie/popular', { page });
  }

  async getMovieGenres(): Promise<any> {
    return this.fetchFromTMDB('/genre/movie/list');
  }

  // Add more methods as needed
}
