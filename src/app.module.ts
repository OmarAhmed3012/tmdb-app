import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TmdbModule } from './tmdb/tmdb.module';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { DataSeedService } from './database/data-seed.service';
import { RatingsModule } from './ratings/ratings.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    TmdbModule,
    MoviesModule,
    GenresModule,
    RatingsModule,
    UsersModule,
    // Other modules...
  ],
  providers: [DataSeedService],
})
export class AppModule {}
