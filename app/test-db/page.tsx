import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export default async function TestDbPage() {
  let dbInfo = null;
  let error = null;

  try {
    // 连接数据库
    await dbConnect();
    
    // 获取数据库信息
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('数据库连接失败');
    }

    // 获取所有集合
    const collections = await db.listCollections().toArray();
    
    // 检查User模型的collection名称
    const userModelCollectionName = User.collection.name;
    
    // Mongoose查询
    const mongooseUserCount = await User.countDocuments();
    const mongooseUsers = await User.find({}).limit(3);
    
    // 直接查询users collection
    const usersCollection = db.collection('users');
    const directUserCount = await usersCollection.countDocuments();
    const directUsers = await usersCollection.find({}).limit(3).toArray();
    
    dbInfo = {
      success: true,
      dbName: db.databaseName,
      collections: collections.map(c => ({ name: c.name, type: c.type })),
      userModelCollection: userModelCollectionName,
      mongooseQuery: {
        count: mongooseUserCount,
        users: mongooseUsers.map(u => ({
          _id: u._id.toString(),
          walletAddress: u.walletAddress,
          username: u.username
        }))
      },
      directQuery: {
        count: directUserCount,
        users: directUsers.map(u => ({
          _id: u._id.toString(),
          walletAddress: u.walletAddress,
          username: u.username
        }))
      }
    };

  } catch (err) {
    error = err instanceof Error ? err.message : '未知错误';
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">数据库测试页面</h1>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>错误：</strong> {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">连接信息</h2>
              <p><strong>数据库名称：</strong> {dbInfo?.dbName}</p>
              <p><strong>User模型collection：</strong> {dbInfo?.userModelCollection}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">所有集合</h2>
              <ul className="list-disc list-inside">
                {dbInfo?.collections.map((c, i) => (
                  <li key={i}>{c.name} ({c.type})</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Mongoose查询结果</h2>
                <p><strong>用户数：</strong> {dbInfo?.mongooseQuery.count}</p>
                <div className="mt-4">
                  <h3 className="font-semibold">用户列表：</h3>
                  {dbInfo?.mongooseQuery.users.length === 0 ? (
                    <p className="text-gray-500">无用户</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm">
                      {dbInfo?.mongooseQuery.users.map((u, i) => (
                        <li key={i}>
                          {u.walletAddress} ({u.username || '无用户名'})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">直接查询结果</h2>
                <p><strong>用户数：</strong> {dbInfo?.directQuery.count}</p>
                <div className="mt-4">
                  <h3 className="font-semibold">用户列表：</h3>
                  {dbInfo?.directQuery.users.length === 0 ? (
                    <p className="text-gray-500">无用户</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm">
                      {dbInfo?.directQuery.users.map((u, i) => (
                        <li key={i}>
                          {u.walletAddress} ({u.username || '无用户名'})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">诊断说明：</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• 如果两种查询方式结果不同，说明collection名称映射有问题</li>
                <li>• 如果都是0但MongoDB Atlas显示有数据，说明连接的数据库不对</li>
                <li>• 这个页面绕过所有缓存，显示真实的数据库状态</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 