-- なりすまし防止システム: ユーザーテーブルに追加
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerificationToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isOfficialAccount" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "officialBadge" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationLevel" INTEGER NOT NULL DEFAULT 0;

-- なりすまし防止: Personaテーブルに追加
ALTER TABLE "Persona" ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Persona" ADD COLUMN IF NOT EXISTS "verifiedBy" TEXT;
ALTER TABLE "Persona" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3);
ALTER TABLE "Persona" ADD COLUMN IF NOT EXISTS "reportCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Persona" ADD COLUMN IF NOT EXISTS "isSuspended" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Persona" ADD COLUMN IF NOT EXISTS "suspendedReason" TEXT;

-- インデックス追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS "User_isOfficialAccount_idx" ON "User"("isOfficialAccount");
CREATE INDEX IF NOT EXISTS "User_verificationLevel_idx" ON "User"("verificationLevel");
CREATE INDEX IF NOT EXISTS "Persona_isVerified_idx" ON "Persona"("isVerified");
CREATE INDEX IF NOT EXISTS "Persona_isSuspended_idx" ON "Persona"("isSuspended");
