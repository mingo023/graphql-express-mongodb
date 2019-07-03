import { Event } from '../../../models';
import { IEvent } from '../../../models/event-model';

export async function eventItems(): Promise<IEvent[]> {
  try {
    return await Event.find()
      .populate('user')
      .lean();
  } catch (err) {
    throw new Error(err);
  }
}
