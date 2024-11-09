import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop()
  title: string;

  @Prop()
  overview: string;

  @Prop()
  release_date: string;

  @Prop({ type: [Number] })
  genre_ids: number[];

  @Prop()
  poster_path: string;

  @Prop()
  popularity: number;

  @Prop()
  vote_average: number;

  @Prop()
  vote_count: number;

  // Add more fields as needed
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
