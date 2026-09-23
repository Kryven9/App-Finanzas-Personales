import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import Boton from '../../componentes/comunes/Boton';
import Tarjeta from '../../componentes/comunes/Tarjeta';
import Modal from '../../componentes/comunes/Modal';
import Cargando from '../../componentes/comunes/Cargando';
import EstadoVacio from '../../componentes/comunes/EstadoVacio';
import DialogoConfirmacion from '../../componentes/comunes/DialogoConfirmacion';
import TarjetaCuenta from './componentes/TarjetaCuenta';
import FormularioCuenta from './componentes/FormularioCuenta';
import { useCuentas } from '../../hooks/useCuentas';
import { formatearMoneda } from '../../compartido/formato';

export default function Cuentas() {
  const { cuentas, patrimonioNeto, cargando, crear, actualizar, eliminar } = useCuentas();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cuentaEditando, setCuentaEditando] = useState(null);
  const [cuentaAEliminar, setCuentaAEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);

  function abrirModalNueva() {
    setCuentaEditando(null);
    setModalAbierto(true);
  }

  function abrirModalEdicion(cuenta) {
    setCuentaEditando(cuenta);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setCuentaEditando(null);
  }

  async function manejarGuardar(datos) {
    setProcesando(true);
    const exito = cuentaEditando ? await actualizar(cuentaEditando.id, datos) : await crear(datos);
    setProcesando(false);

    if (exito) cerrarModal();
  }

  async function manejarEliminar() {
    setProcesando(true);
    await eliminar(cuentaAEliminar.id);
    setProcesando(false);
    setCuentaAEliminar(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Cuentas</h1>
        <Boton onClick={abrirModalNueva}>
          <Plus className="h-4 w-4" />
          Nueva cuenta
        </Boton>
      </div>

      <Tarjeta className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <Wallet className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Patrimonio neto</p>
          <p className="text-2xl font-bold text-slate-900">{formatearMoneda(patrimonioNeto)}</p>
        </div>
      </Tarjeta>

      {cargando ? (
        <Cargando />
      ) : cuentas.length === 0 ? (
        <EstadoVacio
          titulo="Aun no tienes cuentas"
          descripcion="Crea tu primera cuenta para empezar a registrar transacciones"
          accion={
            <Boton onClick={abrirModalNueva}>
              <Plus className="h-4 w-4" />
              Crear cuenta
            </Boton>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cuentas.map((cuenta) => (
            <TarjetaCuenta
              key={cuenta.id}
              cuenta={cuenta}
              onEditar={() => abrirModalEdicion(cuenta)}
              onEliminar={() => setCuentaAEliminar(cuenta)}
            />
          ))}
        </div>
      )}

      <Modal
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        titulo={cuentaEditando ? 'Editar cuenta' : 'Nueva cuenta'}
      >
        <FormularioCuenta
          key={cuentaEditando?.id ?? 'nueva'}
          cuenta={cuentaEditando}
          cargando={procesando}
          onGuardar={manejarGuardar}
          onCancelar={cerrarModal}
        />
      </Modal>

      <DialogoConfirmacion
        abierto={Boolean(cuentaAEliminar)}
        titulo="Eliminar cuenta"
        mensaje={`¿Seguro que deseas eliminar la cuenta "${cuentaAEliminar?.nombre}"? Esta accion no se puede deshacer.`}
        cargando={procesando}
        onConfirmar={manejarEliminar}
        onCancelar={() => setCuentaAEliminar(null)}
      />
    </div>
  );
}
