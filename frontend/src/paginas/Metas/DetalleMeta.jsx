import { Pencil, Plus, Target, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Boton from '../../componentes/comunes/Boton';
import Tarjeta from '../../componentes/comunes/Tarjeta';
import Modal from '../../componentes/comunes/Modal';
import DialogoConfirmacion from '../../componentes/comunes/DialogoConfirmacion';
import Cargando from '../../componentes/comunes/Cargando';
import FormularioMeta from './componentes/FormularioMeta';
import FormularioAporte from './componentes/FormularioAporte';
import TablaAportes from './componentes/TablaAportes';
import { useMetasStore } from '../../estados/metas.store';
import { useCuentasStore } from '../../estados/cuentas.store';
import { formatearFecha, obtenerNombreMes } from '../../compartido/fechas';
import { formatearMoneda } from '../../compartido/formato';
import { calcularProgresoMeta } from '../../compartido/progreso-meta';

export default function DetalleMeta() {
  const { id } = useParams();
  const navegar = useNavigate();
  const {
    meta,
    aportes,
    cargandoDetalle,
    cargarDetalle,
    actualizarMeta,
    crearAporte,
    actualizarAporte,
    eliminarAporte,
    eliminarMeta,
  } = useMetasStore();
  const cuentas = useCuentasStore((estado) => estado.cuentas);
  const cargarCuentas = useCuentasStore((estado) => estado.cargar);
  const [modalAbierto, setModalAbierto] = useState(null); // editar | aportar | editar-aporte | null
  const [aporteEditando, setAporteEditando] = useState(null);
  const [aporteAEliminar, setAporteAEliminar] = useState(null);
  const [metaAEliminar, setMetaAEliminar] = useState(false);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarCuentas();
  }, [cargarCuentas]);

  // carga el detalle al montar; si la meta no existe, regresa al listado
  useEffect(() => {
    async function sincronizarDetalle() {
      const exito = await cargarDetalle(id);
      if (!exito) navegar('/metas');
    }

    sincronizarDetalle();
  }, [id, cargarDetalle, navegar]);

  function cerrarModal() {
    setModalAbierto(null);
  }

  // abrir el modal de edicion de aporte requiere tambien seleccionar el aporte
  function abrirEdicionAporte(aporte) {
    setAporteEditando(aporte);
    setModalAbierto('editar-aporte');
  }

  async function manejarGuardarMeta(datos) {
    setProcesando(true);
    const exito = await actualizarMeta(meta.id, datos);
    setProcesando(false);

    if (exito) cerrarModal();
  }

  async function manejarAporte(datos) {
    setProcesando(true);
    const exito = await crearAporte(meta.id, datos);
    setProcesando(false);

    if (exito) cerrarModal();
  }

  async function manejarEditarAporte(datos) {
    setProcesando(true);
    const exito = await actualizarAporte(meta.id, aporteEditando.id, datos);
    setProcesando(false);

    if (exito) cerrarModal();
  }

  async function manejarEliminarMeta() {
    setProcesando(true);
    const exito = await eliminarMeta(meta.id);
    setProcesando(false);

    if (exito) navegar('/metas');
  }

  async function manejarEliminarAporte() {
    setProcesando(true);
    const exito = await eliminarAporte(meta.id, aporteAEliminar.id);
    setProcesando(false);

    if (exito) setAporteAEliminar(null);
  }

  if (!meta) {
    return <Cargando />;
  }

  const { porcentaje, completada, clasesIcono, clasesBarra } = calcularProgresoMeta(meta);

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/metas" className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-700">
        Volver a Metas
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${clasesIcono}`}
          >
            <Target className="h-6 w-6" />
          </div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            {meta.nombre}
            {completada && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Completada
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* linea de progreso y acciones */}
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          {formatearMoneda(meta.montoActual)} / {formatearMoneda(meta.montoObjetivo)} · {porcentaje}
          % · Meta: {obtenerNombreMes(Number(meta.fechaObjetivo.slice(5, 7)))}{' '}
          {meta.fechaObjetivo.slice(0, 4)}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${clasesBarra}`}
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {!completada && (
          <Boton onClick={() => setModalAbierto('aportar')}>
            <Plus className="h-4 w-4" />
            Aportar
          </Boton>
        )}
        <Boton variante="secundario" onClick={() => setModalAbierto('editar')}>
          <Pencil className="h-4 w-4" />
          Editar meta
        </Boton>
        <Boton variante="peligro" onClick={() => setMetaAEliminar(true)}>
          <Trash2 className="h-4 w-4" />
          Eliminar meta
        </Boton>
      </div>

      <Tarjeta titulo="Historial de aportes">
        <TablaAportes
          aportes={aportes}
          cargando={cargandoDetalle}
          onEditar={abrirEdicionAporte}
          onEliminar={setAporteAEliminar}
        />
      </Tarjeta>

      <Modal abierto={modalAbierto === 'editar'} onCerrar={cerrarModal} titulo="Editar meta">
        <FormularioMeta
          key={meta.id}
          meta={meta}
          cargando={procesando}
          onGuardar={manejarGuardarMeta}
          onCancelar={cerrarModal}
        />
      </Modal>

      <Modal
        abierto={modalAbierto === 'aportar'}
        onCerrar={cerrarModal}
        titulo={`Aportar a "${meta.nombre}"`}
      >
        <FormularioAporte
          cuentas={cuentas}
          cargando={procesando}
          onGuardar={manejarAporte}
          onCancelar={cerrarModal}
        />
      </Modal>

      <Modal
        abierto={modalAbierto === 'editar-aporte'}
        onCerrar={cerrarModal}
        titulo="Editar aporte"
      >
        <FormularioAporte
          key={aporteEditando?.id ?? 'ninguno'}
          aporte={aporteEditando}
          cuentas={cuentas}
          cargando={procesando}
          onGuardar={manejarEditarAporte}
          onCancelar={cerrarModal}
        />
      </Modal>

      <DialogoConfirmacion
        abierto={Boolean(aporteAEliminar)}
        titulo="Eliminar aporte"
        mensaje={`¿Seguro que deseas eliminar el aporte del ${
          aporteAEliminar ? formatearFecha(aporteAEliminar.fecha) : ''
        }? Se eliminara tambien la transaccion generada y se revertira su efecto en el saldo.`}
        cargando={procesando}
        onConfirmar={manejarEliminarAporte}
        onCancelar={() => setAporteAEliminar(null)}
      />

      <DialogoConfirmacion
        abierto={metaAEliminar}
        titulo="Eliminar meta"
        mensaje={`¿Seguro que deseas eliminar la meta "${meta.nombre}"? Se eliminaran tambien todos sus aportes. Esta accion no se puede deshacer.`}
        cargando={procesando}
        onConfirmar={manejarEliminarMeta}
        onCancelar={() => setMetaAEliminar(false)}
      />
    </div>
  );
}
