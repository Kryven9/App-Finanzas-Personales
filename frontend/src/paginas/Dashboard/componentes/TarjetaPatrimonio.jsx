import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import Tarjeta from '../../../componentes/comunes/Tarjeta';
import { formatearMoneda } from '../../../compartido/formato';
import { obtenerTipoCuenta } from '../../../compartido/tipos-cuenta';

// patrimonio neto con las cuentas de manera compacto
export default function TarjetaPatrimonio({ patrimonioNeto, cuentas, cargando }) {
  return (
    <Tarjeta titulo="Patrimonio neto">
      {cargando ? (
        <Cargando />
      ) : cuentas.length === 0 ? (
        <EstadoVacio
          titulo="Aun no tienes cuentas"
          descripcion="Crea una cuenta para ver tu patrimonio aqui"
        />
      ) : (
        <>
          <p className="text-2xl font-bold text-slate-900">{formatearMoneda(patrimonioNeto)}</p>

          <div className="mt-3 flex flex-wrap gap-3">
            {cuentas.map((cuenta) => {
              const tipo = obtenerTipoCuenta(cuenta.tipo);
              const Icono = tipo.icono;
              const saldoNegativo = cuenta.saldoActual < 0;

              return (
                <div
                  key={cuenta.id}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-100 text-violet-700">
                    <Icono className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-slate-700">{cuenta.nombre}</span>
                  <span
                    className={`text-sm font-semibold ${saldoNegativo ? 'text-red-600' : 'text-slate-900'}`}
                  >
                    {formatearMoneda(cuenta.saldoActual)}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Tarjeta>
  );
}
