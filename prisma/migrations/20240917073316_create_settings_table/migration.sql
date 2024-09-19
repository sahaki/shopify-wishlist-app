-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "config_path" TEXT NOT NULL,
    "config_value" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_config_path_key" ON "Settings"("config_path");
