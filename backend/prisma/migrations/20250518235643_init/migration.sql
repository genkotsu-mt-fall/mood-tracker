-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "mood" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "templateId" UUID NOT NULL,
    "privacyJson" JSONB NOT NULL,
    "followersOnly" BOOLEAN NOT NULL,
    "followBackOnly" BOOLEAN NOT NULL,
    "minFollowDays" INTEGER NOT NULL,
    "visibleUntil" TIMESTAMP(3),
    "visibleAfter" TIMESTAMP(3),
    "crisisFlag" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
