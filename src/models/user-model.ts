import mongoose, { Schema, Document } from 'mongoose';
import { IEvent } from './event-model';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  events: [IEvent['_id']];
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUser>('User', userSchema);
