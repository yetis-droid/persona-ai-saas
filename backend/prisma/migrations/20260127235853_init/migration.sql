-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "oneLiner" TEXT NOT NULL,
    "creatorCallname" TEXT NOT NULL,
    "fanCallname" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "politenessLevel" INTEGER NOT NULL,
    "emojiUsage" TEXT NOT NULL,
    "replyLength" TEXT NOT NULL,
    "phrasingExamples" TEXT NOT NULL,
    "bannedPhrases" TEXT NOT NULL,
    "relationshipStyle" TEXT NOT NULL,
    "smalltalkLevel" TEXT NOT NULL,
    "supportScope" TEXT NOT NULL,
    "refusalStyle" TEXT NOT NULL,
    "boundaries" TEXT NOT NULL,
    "worldKeywords" TEXT NOT NULL,
    "coreValues" TEXT NOT NULL,
    "consistencyRule" TEXT NOT NULL,
    "faqPairs" TEXT NOT NULL,
    "ngTopicsExtra" TEXT NOT NULL,
    "shareLinks" TEXT NOT NULL,
    "shareInfo" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "lineChannelAccessToken" TEXT,
    "lineChannelSecret" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "fanLineId" TEXT,
    "userMessage" TEXT NOT NULL,
    "aiReply" TEXT NOT NULL,
    "rating" INTEGER,
    "isNgDetected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "Conversation_personaId_createdAt_idx" ON "Conversation"("personaId", "createdAt");

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;
