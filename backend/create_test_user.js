const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // パスワードをハッシュ化
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // ユーザー作成（既存の場合は無視）
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        passwordHash: passwordHash,
        name: 'テストユーザー'
      }
    });
    
    console.log('✅ テストユーザーを作成しました:', user.email);
  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
