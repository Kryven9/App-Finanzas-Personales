import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Boton from '../../componentes/comunes/Boton';
import Modal from '../../componentes/comunes/Modal';
import ListadoRecurrencias from './componentes/ListadoRecurrencias';
import FormularioRecurrencia from './componentes/FormularioRecurrencia';
import ModalEliminarRecurrencia from './componentes/ModalEliminarRecurrencia';
import FiltroEstado from './componentes/FiltroEstado';
import { useRecurrencias } from '../../hooks/useRecurrencias';
import { useCuentasStore } from '../../estados/cuentas.store';
import { useCategoriasStore } from '../../estados/categorias.store';

export default function Recurrencias() {
  const { recurrencias, cargando, crear, actualizar, cambiarEstado, eliminar } = useRecurrencias();
  const { cuentas, cargar: cargarCuentas } = useCuentasStore();
  const { categorias, cargar: cargarCategorias } = useCategoriasStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reglaEditando, setReglaEditando] = useState(null);
  const [reglaAEliminar, setReglaAEliminar] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarCuentas();
    cargarCategorias();
  }, [cargarCuentas, cargarCategorias]);

  function abrirModalNueva() {
    setReglaEditando(null);
    setModalAbierto(true);
  }

  function abrirModalEdicion(regla) {
    setReglaEditando(regla);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setReglaEditando(null);
  }

  async function manejarGuardar(datos) {
    setProcesando(true);
    const exito = reglaEditando ? await actualizar(reglaEditando.id, datos) : await crear(datos);
    setProcesando(false);

    if (exito) cerrarModal();
  }

  async function manejarCambiarEstado(regla) {
    setProcesando(true);
    await cambiarEstado(regla.id, !regla.activa);
    setProcesando(false);
  }

  // eliminarGeneradas = false -> conserva las transacciones generadas como independientes
  async function manejarEliminar(eliminarGeneradas) {
    setProcesando(true);

    const exito = await eliminar(reglaAEliminar.id, eliminarGeneradas);

    setProcesando(false);

    if (exito) setReglaAEliminar(null);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Transacciones recurrentes</h1>
        <Boton onClick={abrirModalNueva}>
          <Plus className="h-4 w-4" />
          Nueva regla
        </Boton>
      </div>

      {!cargando && recurrencias.length > 0 && (
        <FiltroEstado
          recurrencias={recurrencias}
          valor={filtroEstado}
          onCambiar={setFiltroEstado}
        />
      )}

      <ListadoRecurrencias
        cargando={cargando}
        recurrencias={recurrencias}
        filtro={filtroEstado}
        onLimpiarFiltro={() => setFiltroEstado('todas')}
        onNueva={abrirModalNueva}
        onEditar={abrirModalEdicion}
        onCambiarEstado={manejarCambiarEstado}
        onEliminar={setReglaAEliminar}
      />

      <Modal
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        titulo={reglaEditando ? 'Editar regla' : 'Nueva regla'}
      >
        <FormularioRecurrencia
          key={reglaEditando?.id ?? 'nueva'}
          regla={reglaEditando}
          cuentas={cuentas}
          categorias={categorias}
          cargando={procesando}
          onGuardar={manejarGuardar}
          onCancelar={cerrarModal}
        />
      </Modal>

      <ModalEliminarRecurrencia
        regla={reglaAEliminar}
        cargando={procesando}
        onEliminar={manejarEliminar}
        onCerrar={() => setReglaAEliminar(null)}
      />
    </div>
  );
}
