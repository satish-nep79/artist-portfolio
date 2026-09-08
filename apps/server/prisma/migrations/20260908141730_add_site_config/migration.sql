-- CreateTable
CREATE TABLE "site_configs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Bikram Nepali',
    "profile_image_url" TEXT,
    "quote" TEXT,
    "bio_paragraphs" TEXT[],
    "philosophy_title" TEXT,
    "philosophy_text" TEXT,
    "inspiration_title" TEXT,
    "inspiration_text" TEXT,
    "approach_title" TEXT,
    "approach_text" TEXT,
    "location" TEXT NOT NULL,
    "map_url" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "response_time_message" TEXT NOT NULL,
    "instagram_url" TEXT,
    "facebook_url" TEXT,
    "twitter_url" TEXT,
    "linkedin_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_configs_pkey" PRIMARY KEY ("id")
);
