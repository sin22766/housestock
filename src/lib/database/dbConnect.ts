import mongoose from 'mongoose';

let MONGODB_URI: string;

if (process.env.NODE_ENV === 'production') {
    // For production
    MONGODB_URI = String(process.env.MY_MONGODB_URL);
} else {
    // For development
    MONGODB_URI = import.meta.env.VITE_MY_MONGODB_URL;
}

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env'
    )
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default dbConnect
