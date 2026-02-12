const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'yetis.nagata@gmail.com' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      subscriptionTier: true,
      subscriptionStatus: true
    }
  });
  
  console.log('📊 ユーザー情報:');
  console.log(JSON.stringify(user, null, 2));
  
  await prisma.$disconnect();
}

main().catch(console.error);
