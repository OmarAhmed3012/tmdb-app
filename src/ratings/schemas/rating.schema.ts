import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RatingDocument = Rating & Document;

@Schema()
export class Rating {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  movieId: number;

  @Prop({ required: true, min: 0, max: 10 })
  rating: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
