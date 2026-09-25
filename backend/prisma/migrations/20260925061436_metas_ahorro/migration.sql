/*
  Warnings:

  - A unique constraint covering the columns `[id_transaccion]` on the table `aportes_meta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_cuenta` to the `aportes_meta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_transaccion` to the `aportes_meta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "aportes_meta" ADD COLUMN     "id_cuenta" TEXT NOT NULL,
ADD COLUMN     "id_transaccion" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categorias" ADD COLUMN     "es_sistema" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "aportes_meta_id_transaccion_key" ON "aportes_meta"("id_transaccion");

-- AddForeignKey
ALTER TABLE "aportes_meta" ADD CONSTRAINT "aportes_meta_id_cuenta_fkey" FOREIGN KEY ("id_cuenta") REFERENCES "cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aportes_meta" ADD CONSTRAINT "aportes_meta_id_transaccion_fkey" FOREIGN KEY ("id_transaccion") REFERENCES "transacciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
