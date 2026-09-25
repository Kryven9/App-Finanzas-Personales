import { useEffect, useState } from 'react';
import { Plus, Target } from 'lucide-react';
import Boton from '../../componentes/comunes/Boton';
import Tarjeta from '../../componentes/comunes/Tarjeta';
import Modal from '../../componentes/comunes/Modal';
import ListadoMetas from './componentes/ListadoMetas';
import FormularioMeta from './componentes/FormularioMeta';
import FormularioAporte from './componentes/FormularioAporte';
import { useMetasStore } from '../../estados/metas.store';
import { useCuentasStore } from '../../estados/cuentas.store';
import { formatearMoneda } from '../../compartido/formato';

export default function Metas() {
  const metas = useMetasStore((estado) => estado.metas);
  const cargando = useMetasStore((estado) => estado.cargando);
  const cargar = useMetasStore((estado) => estado.cargar);
  const crear = useMetasStore((estado) => estado.crear);
  const crearAporte = useMetasStore((estado) => estado.crearAporte);
  const cuentas = useCuentasStore((estado) => estado.cuentas);
  const cargarCuentas = useCuentasStore((estado) => estado.cargar);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [metaAportando, setMetaAportando] = useState(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargar();
    cargarCuentas();
  }, [cargar, cargarCuentas]);

  const totalAhorrado = metas.reduce((total, meta) => total + meta.montoActual, 0);
  const totalObjetivo = metas.reduce((total, meta) => total + meta.montoObjetivo, 0);
  const porcentajeAhorrado =
    totalObjetivo > 0 ? Math.round((totalAhorrado / totalObjetivo) * 100) : 0;

  function abrirModalNueva() {
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
  }

  async function manejarGuardar(datos) {
    setProcesando(true);
    const exito = await crear(datos);
    setProcesando(false);

    if (exito) cerrarModal();
  }

  async function manejarAporte(datos) {
    setProcesando(true);
    const exito = await crearAporte(metaAportando.id, datos);
    setProcesando(false);

    if (exito) cerrarAporte();
  }

  function cerrarAporte() {
    setMetaAportando(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Metas de ahorro</h1>
        <Boton onClick={abrirModalNueva}>
          <Plus className="h-4 w-4" />
          Nueva meta
        </Boton>
      </div>

      {metas.length > 0 && (
        <Tarjeta className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total ahorrado</p>
            <p className="text-lg font-bold text-slate-900">
              {formatearMoneda(totalAhorrado)}
              <span className="ml-4 text-sm font-medium text-slate-500">
                de {formatearMoneda(totalObjetivo)} ({porcentajeAhorrado}%)
              </span>
            </p>
          </div>
        </Tarjeta>
      )}

      <ListadoMetas
        cargando={cargando}
        metas={metas}
        onNueva={abrirModalNueva}
        onAportar={setMetaAportando}
      />

      <Modal abierto={modalAbierto} onCerrar={cerrarModal} titulo="Nueva meta">
        <FormularioMeta cargando={procesando} onGuardar={manejarGuardar} onCancelar={cerrarModal} />
      </Modal>

      <Modal
        abierto={Boolean(metaAportando)}
        onCerrar={cerrarAporte}
        titulo={`Aportar a "${metaAportando?.nombre}"`}
      >
        <FormularioAporte
          key={metaAportando?.id ?? 'ninguna'}
          cuentas={cuentas}
          cargando={procesando}
          onGuardar={manejarAporte}
          onCancelar={cerrarAporte}
        />
      </Modal>
    </div>
  );
}
