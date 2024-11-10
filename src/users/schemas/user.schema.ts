import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ type: [Number], default: [] })
  watchlist: number[];

  @Prop({ type: [Number], default: [] })
  favorites: number[];
}

export const UserSchema = SchemaFactory.createForClass(User);
