import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user-model';

export interface IEvent extends Document {
  user: IUser['_id'];
  title: string;
  description: string;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', eventSchema);
