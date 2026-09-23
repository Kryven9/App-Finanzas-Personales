import { ErrorApi } from '../../compartido/middlewares/error.middleware.js';
import { cuentasRepositorio } from './cuentas.repositorio.js';

const redondearMonto = (monto) => Math.round(monto * 100) / 100;

// agrupa ingresos y gastos por cuenta y calcula el saldo actual -> saldoInicial +
// ingresos - gastos de sus transacciones
function agregarSaldos(cuentas, resumen) {
  const ingresosYGastosPorCuenta = new Map();

  for (const fila of resumen) {
    const acumulado = ingresosYGastosPorCuenta.get(fila.idCuenta) ?? { ingresos: 0, gastos: 0 };
    const monto = Number(fila._sum.monto ?? 0);

    if (fila.tipo === 'INGRESO') {
      acumulado.ingresos += monto;
    } else {
      acumulado.gastos += monto;
    }

    ingresosYGastosPorCuenta.set(fila.idCuenta, acumulado);
  }

  return cuentas.map((cuenta) => {
    const { ingresos = 0, gastos = 0 } = ingresosYGastosPorCuenta.get(cuenta.id) ?? {};
    const { idUsuario: _idUsuario, _count, ...datos } = cuenta;

    return {
      ...datos,
      saldoInicial: Number(cuenta.saldoInicial),
      saldoActual: redondearMonto(Number(cuenta.saldoInicial) + ingresos - gastos),
      transacciones: _count?.transacciones ?? 0,
    };
  });
}

export const cuentasServicio = {
  async listar(idUsuario) {
    const [cuentas, resumen] = await Promise.all([
      cuentasRepositorio.listar(idUsuario),
      cuentasRepositorio.resumirTransacciones(idUsuario),
    ]);

    const cuentasConSaldo = agregarSaldos(cuentas, resumen);
    const patrimonioNeto = redondearMonto(
      cuentasConSaldo.reduce((total, cuenta) => total + cuenta.saldoActual, 0),
    );

    return { cuentas: cuentasConSaldo, patrimonioNeto };
  },

  async obtenerPorId(idUsuario, id) {
    const cuenta = await cuentasRepositorio.buscarPorId(idUsuario, id);

    if (!cuenta) {
      throw new ErrorApi('Cuenta no encontrada', 404);
    }

    const resumen = await cuentasRepositorio.resumirTransacciones(idUsuario, id);
    const [cuentaConSaldo] = agregarSaldos([cuenta], resumen);
    return cuentaConSaldo;
  },

  async crear(idUsuario, datos) {
    const cuenta = await cuentasRepositorio.crear(idUsuario, datos);
    // una cuenta nueva no tiene transacciones -> su saldo actual es el saldo inicial
    const [cuentaConSaldo] = agregarSaldos([cuenta], []);
    return cuentaConSaldo;
  },

  async actualizar(idUsuario, id, datos) {
    const cuenta = await cuentasRepositorio.buscarPorId(idUsuario, id);

    if (!cuenta) {
      throw new ErrorApi('Cuenta no encontrada', 404);
    }

    const actualizada = await cuentasRepositorio.actualizar(id, datos);
    // si el saldo inicial cambio, el saldo actual se recalcula con las transacciones existentes
    const resumen = await cuentasRepositorio.resumirTransacciones(idUsuario, id);
    const [cuentaConSaldo] = agregarSaldos([actualizada], resumen);
    return cuentaConSaldo;
  },

  async eliminar(idUsuario, id) {
    const cuenta = await cuentasRepositorio.buscarPorId(idUsuario, id);

    if (!cuenta) {
      throw new ErrorApi('Cuenta no encontrada', 404);
    }

    if (cuenta._count.transacciones > 0) {
      throw new ErrorApi(
        'No se puede eliminar la cuenta porque tiene transacciones asociadas. Elimina o reasigna esas transacciones primero.',
        409,
      );
    }

    await cuentasRepositorio.eliminar(id);
  },
};
