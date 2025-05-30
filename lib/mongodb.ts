import mongoose from 'mongoose';

// 从环境变量读取数据库连接字符串，不再硬编码
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/game-pump-local';

if (!MONGODB_URI) {
  throw new Error('请在环境变量中定义MONGODB_URI - 数据库连接字符串未设置');
}

/**
 * 全局缓存MongoDB连接
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI环境变量未设置');
    }
    
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;