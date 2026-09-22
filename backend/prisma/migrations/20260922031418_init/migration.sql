-- CreateEnum
CREATE TYPE "TipoCuenta" AS ENUM ('EFECTIVO', 'BANCO', 'TARJETA_CREDITO', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoCategoria" AS ENUM ('INGRESO', 'GASTO');

-- CreateEnum
CREATE TYPE "TipoTransaccion" AS ENUM ('INGRESO', 'GASTO');

-- CreateEnum
CREATE TYPE "FrecuenciaRecurrencia" AS ENUM ('SEMANAL', 'MENSUAL', 'ANUAL');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena_hash" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoCuenta" NOT NULL,
    "saldo_inicial" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoCategoria" NOT NULL,
    "es_predefinida" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacciones_recurrentes" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_cuenta" TEXT NOT NULL,
    "id_categoria" TEXT NOT NULL,
    "tipo" "TipoTransaccion" NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "descripcion" TEXT,
    "frecuencia" "FrecuenciaRecurrencia" NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "proxima_fecha_generacion" TIMESTAMP(3) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacciones_recurrentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacciones" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_cuenta" TEXT NOT NULL,
    "id_categoria" TEXT NOT NULL,
    "id_transaccion_recurrente" TEXT,
    "tipo" "TipoTransaccion" NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presupuestos" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_categoria" TEXT NOT NULL,
    "monto_limite" DECIMAL(65,30) NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presupuestos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas_ahorro" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "monto_objetivo" DECIMAL(65,30) NOT NULL,
    "monto_actual" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "fecha_objetivo" TIMESTAMP(3) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metas_ahorro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aportes_meta" (
    "id" TEXT NOT NULL,
    "id_meta" TEXT NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aportes_meta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE INDEX "transacciones_recurrentes_id_usuario_activa_idx" ON "transacciones_recurrentes"("id_usuario", "activa");

-- CreateIndex
CREATE INDEX "transacciones_id_usuario_fecha_idx" ON "transacciones"("id_usuario", "fecha");

-- CreateIndex
CREATE INDEX "transacciones_id_cuenta_idx" ON "transacciones"("id_cuenta");

-- CreateIndex
CREATE INDEX "transacciones_id_categoria_idx" ON "transacciones"("id_categoria");

-- CreateIndex
CREATE INDEX "transacciones_id_transaccion_recurrente_idx" ON "transacciones"("id_transaccion_recurrente");

-- CreateIndex
CREATE UNIQUE INDEX "transacciones_id_transaccion_recurrente_fecha_key" ON "transacciones"("id_transaccion_recurrente", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "presupuestos_id_usuario_id_categoria_mes_anio_key" ON "presupuestos"("id_usuario", "id_categoria", "mes", "anio");

-- AddForeignKey
ALTER TABLE "cuentas" ADD CONSTRAINT "cuentas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones_recurrentes" ADD CONSTRAINT "transacciones_recurrentes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones_recurrentes" ADD CONSTRAINT "transacciones_recurrentes_id_cuenta_fkey" FOREIGN KEY ("id_cuenta") REFERENCES "cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones_recurrentes" ADD CONSTRAINT "transacciones_recurrentes_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_id_cuenta_fkey" FOREIGN KEY ("id_cuenta") REFERENCES "cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_id_transaccion_recurrente_fkey" FOREIGN KEY ("id_transaccion_recurrente") REFERENCES "transacciones_recurrentes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas_ahorro" ADD CONSTRAINT "metas_ahorro_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aportes_meta" ADD CONSTRAINT "aportes_meta_id_meta_fkey" FOREIGN KEY ("id_meta") REFERENCES "metas_ahorro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
