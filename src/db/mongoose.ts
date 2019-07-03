import mongoose from 'mongoose';

mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

export default async function connect(): Promise<void> {
  await mongoose.connect(process.env.MONGO_URI, {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true
  });
}
