import { useEffect, useState } from 'react';
import { Plus, Shapes } from 'lucide-react';
import Boton from '../../componentes/comunes/Boton';
import Tarjeta from '../../componentes/comunes/Tarjeta';
import Modal from '../../componentes/comunes/Modal';
import DialogoConfirmacion from '../../componentes/comunes/DialogoConfirmacion';
import ListadoCategorias from './componentes/ListadoCategorias';
import FormularioCategoria from './componentes/FormularioCategoria';
import { useCategoriasStore } from '../../estados/categorias.store';
import { FILTROS_CATEGORIA } from '../../compartido/tipos-movimiento';

export default function Categorias() {
  const { categorias, cargando, crear, actualizar, eliminar, cargar } = useCategoriasStore();
  const [filtroTipo, setFiltroTipo] = useState('TODAS');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const categoriasFiltradas =
    filtroTipo === 'TODAS'
      ? categorias
      : categorias.filter((categoria) => categoria.tipo === filtroTipo);

  function abrirModalNueva() {
    setCategoriaEditando(null);
    setModalAbierto(true);
  }

  function abrirModalEdicion(categoria) {
    setCategoriaEditando(categoria);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setCategoriaEditando(null);
  }

  async function manejarGuardar(datos) {
    setProcesando(true);
    const exito = categoriaEditando
      ? await actualizar(categoriaEditando.id, datos)
      : await crear(datos);
    setProcesando(false);

    if (exito) cerrarModal();
  }

  async function manejarEliminar() {
    setProcesando(true);
    await eliminar(categoriaAEliminar.id);
    setProcesando(false);
    setCategoriaAEliminar(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Categorias</h1>
        <Boton onClick={abrirModalNueva}>
          <Plus className="h-4 w-4" />
          Nueva categoria
        </Boton>
      </div>

      <Tarjeta className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <Shapes className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Total de categorias</p>
          <p className="text-2xl font-bold text-slate-900">{categorias.length}</p>
        </div>
      </Tarjeta>

      <div className="mb-4 flex gap-2">
        {FILTROS_CATEGORIA.map((filtro) => (
          <Boton
            key={filtro.valor}
            tamano="sm"
            variante={filtroTipo === filtro.valor ? 'primario' : 'secundario'}
            onClick={() => setFiltroTipo(filtro.valor)}
          >
            {filtro.etiqueta}
          </Boton>
        ))}
      </div>

      <ListadoCategorias
        cargando={cargando}
        totalCategorias={categorias.length}
        categoriasFiltradas={categoriasFiltradas}
        onNueva={abrirModalNueva}
        onEditar={abrirModalEdicion}
        onEliminar={setCategoriaAEliminar}
      />

      <Modal
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        titulo={categoriaEditando ? 'Editar categoria' : 'Nueva categoria'}
      >
        <FormularioCategoria
          key={categoriaEditando?.id ?? 'nueva'}
          categoria={categoriaEditando}
          cargando={procesando}
          onGuardar={manejarGuardar}
          onCancelar={cerrarModal}
        />
      </Modal>

      <DialogoConfirmacion
        abierto={Boolean(categoriaAEliminar)}
        titulo="Eliminar categoria"
        mensaje={`¿Seguro que deseas eliminar la categoria "${categoriaAEliminar?.nombre}"? Esta accion no se puede deshacer.`}
        cargando={procesando}
        onConfirmar={manejarEliminar}
        onCancelar={() => setCategoriaAEliminar(null)}
      />
    </div>
  );
}
