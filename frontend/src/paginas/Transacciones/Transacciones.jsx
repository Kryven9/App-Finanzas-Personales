import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Boton from '../../componentes/comunes/Boton';
import Tarjeta from '../../componentes/comunes/Tarjeta';
import Modal from '../../componentes/comunes/Modal';
import DialogoConfirmacion from '../../componentes/comunes/DialogoConfirmacion';
import FiltrosTransaccion from './componentes/FiltrosTransaccion';
import ListadoTransacciones from './componentes/ListadoTransacciones';
import FormularioTransaccion from './componentes/FormularioTransaccion';
import { useTransacciones } from '../../hooks/useTransacciones';
import { useCuentasStore } from '../../estados/cuentas.store';
import { useCategoriasStore } from '../../estados/categorias.store';
import { formatearFecha } from '../../compartido/fechas';

export default function Transacciones() {
  const {
    transacciones,
    paginacion,
    cargando,
    cargar,
    cambiarPagina,
    crear,
    actualizar,
    eliminar,
  } = useTransacciones();
  const { cuentas, cargar: cargarCuentas } = useCuentasStore();
  const { categorias, cargar: cargarCategorias } = useCategoriasStore();
  const [filtros, setFiltros] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [transaccionEditando, setTransaccionEditando] = useState(null);
  const [transaccionAEliminar, setTransaccionAEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarCuentas();
    cargarCategorias();
  }, [cargarCuentas, cargarCategorias]);

  function aplicarFiltros(nuevos) {
    // los filtros nuevos se recargan desde la primera pagina
    setFiltros(nuevos);
    cargar(nuevos);
  }

  function abrirModalNueva() {
    setTransaccionEditando(null);
    setModalAbierto(true);
  }

  function abrirModalEdicion(transaccion) {
    setTransaccionEditando(transaccion);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setTransaccionEditando(null);
  }

  async function manejarGuardar(datos) {
    setProcesando(true);
    const exito = transaccionEditando
      ? await actualizar(transaccionEditando.id, datos)
      : await crear(datos);
    setProcesando(false);

    if (exito) {
      cerrarModal();
      cargar(filtros);
    }
  }

  async function manejarEliminar() {
    setProcesando(true);
    await eliminar(transaccionAEliminar.id);
    setProcesando(false);
    setTransaccionAEliminar(null);
    cargar(filtros);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Transacciones</h1>
        <Boton onClick={abrirModalNueva}>
          <Plus className="h-4 w-4" />
          Nueva transaccion
        </Boton>
      </div>

      <Tarjeta className="mb-6" titulo="Filtros">
        <FiltrosTransaccion cuentas={cuentas} categorias={categorias} onFiltrar={aplicarFiltros} />
      </Tarjeta>

      <ListadoTransacciones
        cargando={cargando}
        transacciones={transacciones}
        paginacion={paginacion}
        onNueva={abrirModalNueva}
        onEditar={abrirModalEdicion}
        onEliminar={setTransaccionAEliminar}
        onCambiarPagina={cambiarPagina}
      />

      <Modal
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        titulo={transaccionEditando ? 'Editar transaccion' : 'Nueva transaccion'}
      >
        <FormularioTransaccion
          key={transaccionEditando?.id ?? 'nueva'}
          transaccion={transaccionEditando}
          cuentas={cuentas}
          categorias={categorias}
          cargando={procesando}
          onGuardar={manejarGuardar}
          onCancelar={cerrarModal}
        />
      </Modal>

      <DialogoConfirmacion
        abierto={Boolean(transaccionAEliminar)}
        titulo="Eliminar transaccion"
        mensaje={`¿Seguro que deseas eliminar la transaccion del ${transaccionAEliminar ? formatearFecha(transaccionAEliminar.fecha) : ''}? Esta accion no se puede deshacer.`}
        cargando={procesando}
        onConfirmar={manejarEliminar}
        onCancelar={() => setTransaccionAEliminar(null)}
      />
    </div>
  );
}
