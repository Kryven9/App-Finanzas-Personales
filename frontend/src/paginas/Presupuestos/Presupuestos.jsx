import { useEffect, useState } from 'react';
import { Plus, PiggyBank } from 'lucide-react';
import Boton from '../../componentes/comunes/Boton';
import Tarjeta from '../../componentes/comunes/Tarjeta';
import Modal from '../../componentes/comunes/Modal';
import DialogoConfirmacion from '../../componentes/comunes/DialogoConfirmacion';
import FiltroPeriodo from './componentes/FiltroPeriodo';
import ListadoPresupuestos from './componentes/ListadoPresupuestos';
import FormularioPresupuesto from './componentes/FormularioPresupuesto';
import { usePresupuestos } from '../../hooks/usePresupuestos';
import { useCategoriasStore } from '../../estados/categorias.store';
import { formatearMoneda } from '../../compartido/formato';
import { obtenerNombreMes } from '../../compartido/fechas';

export default function Presupuestos() {
  const { presupuestos, periodo, cargando, cambiarPeriodo, crear, actualizar, eliminar } =
    usePresupuestos();
  const categorias = useCategoriasStore((estado) => estado.categorias);
  const cargarCategorias = useCategoriasStore((estado) => estado.cargar);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [presupuestoEditando, setPresupuestoEditando] = useState(null);
  const [presupuestoAEliminar, setPresupuestoAEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const totalPresupuestado = presupuestos.reduce(
    (total, presupuesto) => total + presupuesto.montoLimite,
    0,
  );
  const totalGastoReal = presupuestos.reduce(
    (total, presupuesto) => total + presupuesto.gastoReal,
    0,
  );
  const porcentajeGastado =
    totalPresupuestado > 0 ? Math.round((totalGastoReal / totalPresupuestado) * 100) : 0;

  function abrirModalNueva() {
    setPresupuestoEditando(null);
    setModalAbierto(true);
  }

  function abrirModalEdicion(presupuesto) {
    setPresupuestoEditando(presupuesto);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setPresupuestoEditando(null);
  }

  async function manejarGuardar(datos) {
    setProcesando(true);
    const exito = presupuestoEditando
      ? await actualizar(presupuestoEditando.id, datos)
      : await crear(datos);
    setProcesando(false);

    if (exito) cerrarModal();
  }

  async function manejarEliminar() {
    setProcesando(true);
    await eliminar(presupuestoAEliminar.id);
    setProcesando(false);
    setPresupuestoAEliminar(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Presupuestos</h1>
        <Boton onClick={abrirModalNueva}>
          <Plus className="h-4 w-4" />
          Nueva presupuesto
        </Boton>
      </div>

      <Tarjeta className="mb-6" titulo="Periodo">
        <FiltroPeriodo periodo={periodo} onCambiar={cambiarPeriodo} />
      </Tarjeta>

      {presupuestos.length > 0 && (
        <Tarjeta className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <PiggyBank className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              {obtenerNombreMes(periodo.mes)} {periodo.anio}
            </p>
            <p className="text-lg font-bold text-slate-900">
              <span className="font-medium text-slate-500">Presupuestado: </span>
              {formatearMoneda(totalPresupuestado)}
              <span className="ml-4 font-medium text-slate-500">Gastado: </span>
              {formatearMoneda(totalGastoReal)}
              <span className="ml-2 text-sm font-semibold text-slate-500">
                ({porcentajeGastado}%)
              </span>
            </p>
          </div>
        </Tarjeta>
      )}

      <ListadoPresupuestos
        cargando={cargando}
        presupuestos={presupuestos}
        onNueva={abrirModalNueva}
        onEditar={abrirModalEdicion}
        onEliminar={setPresupuestoAEliminar}
      />

      <Modal
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        titulo={presupuestoEditando ? 'Editar presupuesto' : 'Nueva presupuesto'}
      >
        <FormularioPresupuesto
          key={presupuestoEditando?.id ?? 'nueva'}
          presupuesto={presupuestoEditando}
          periodo={periodo}
          categorias={categorias}
          cargando={procesando}
          onGuardar={manejarGuardar}
          onCancelar={cerrarModal}
        />
      </Modal>

      <DialogoConfirmacion
        abierto={Boolean(presupuestoAEliminar)}
        titulo="Eliminar presupuesto"
        mensaje={`¿Seguro que deseas eliminar el presupuesto de "${presupuestoAEliminar?.categoriaNombre}"? Esta accion no se puede deshacer.`}
        cargando={procesando}
        onConfirmar={manejarEliminar}
        onCancelar={() => setPresupuestoAEliminar(null)}
      />
    </div>
  );
}
