import mongoose from "mongoose";

export type ObjectId = mongoose.Types.ObjectId

export async function connectToMongo(location: string, port: string, name: string) {

    const uri = `mongodb://${location}:${port}/${name}`;
    await mongoose.connect(uri, { useNewUrlParser: true });

    mongoose.connection.on('error', (err) => {
        console.error('Unable to connect to Mongo via Mongoose', err);
    });
}
