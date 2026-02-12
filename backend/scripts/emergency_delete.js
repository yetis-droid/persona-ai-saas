// 著作権侵害対応: 緊急削除スクリプト
// 使い方: node emergency_delete.js <personaId>

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function emergencyDelete(personaId, reason) {
  console.log(`🚨 緊急削除開始: ${personaId}`);
  
  try {
    // 1. 人格を完全停止
    const persona = await prisma.persona.update({
      where: { id: personaId },
      data: {
        isActive: false,
        isSuspended: true,
        suspendedReason: `著作権侵害: ${reason}`,
      },
      include: { user: true }
    });
    
    console.log('✅ 人格を停止しました');
    console.log(`   作成者: ${persona.user.email}`);
    console.log(`   名前: ${persona.creatorCallname}`);
    
    // 2. 監査ログに記録
    await prisma.usageLog.create({
      data: {
        userId: 'SYSTEM',
        action: 'emergency_copyright_takedown',
        metadata: JSON.stringify({
          personaId,
          reason,
          creatorEmail: persona.user.email,
          creatorCallname: persona.creatorCallname,
          timestamp: new Date().toISOString(),
          legalBasis: 'プロバイダ責任制限法 第3条'
        })
      }
    });
    
    console.log('✅ 監査ログに記録しました');
    
    // 3. ユーザーに通知メール送信（今後実装）
    console.log('📧 ユーザーに通知メール送信（要実装）');
    
    // 4. 権利者に削除完了報告（今後実装）
    console.log('📧 権利者に削除完了報告（要実装）');
    
    console.log('🎉 緊急削除完了');
    
  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// コマンドライン引数から実行
const personaId = process.argv[2];
const reason = process.argv[3] || '著作権侵害の申し立てを受けました';

if (!personaId) {
  console.error('使い方: node emergency_delete.js <personaId> [理由]');
  process.exit(1);
}

emergencyDelete(personaId, reason);
