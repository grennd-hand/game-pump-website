const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

// Devnet 连接
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

async function airdropSOL(walletAddress, amount = 1) {
  try {
    console.log(`🚁 请求为钱包 ${walletAddress} 空投 ${amount} SOL...`);
    
    const publicKey = new PublicKey(walletAddress);
    
    // 请求空投
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );
    
    console.log(`📋 交易签名: ${signature}`);
    
    // 等待确认
    await connection.confirmTransaction(signature);
    
    // 检查余额
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    
    console.log(`✅ 空投成功！当前余额: ${solBalance} SOL`);
    return solBalance;
    
  } catch (error) {
    console.error('❌ 空投失败:', error.message);
    
    if (error.message.includes('airdrop request limit')) {
      console.log('💡 提示: devnet空投有频率限制，请稍后重试或使用以下方法：');
      console.log('1. 访问 https://faucet.solana.com/');
      console.log('2. 使用命令: solana airdrop 1 <your-wallet-address> --url devnet');
      console.log(`3. 直接为钱包 ${walletAddress} 请求空投`);
    }
    
    return null;
  }
}

// 命令行使用
if (require.main === module) {
  const walletAddress = process.argv[2];
  const amount = parseFloat(process.argv[3]) || 1;
  
  if (!walletAddress) {
    console.log('用法: node scripts/devnet-airdrop.js <钱包地址> [金额]');
    console.log('例如: node scripts/devnet-airdrop.js 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM 2');
    process.exit(1);
  }
  
  airdropSOL(walletAddress, amount);
}

module.exports = { airdropSOL }; 