-- CreateTable
CREATE TABLE "Wishlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_customerId_key" ON "Wishlist"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_productId_key" ON "Wishlist"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_shop_key" ON "Wishlist"("shop");
