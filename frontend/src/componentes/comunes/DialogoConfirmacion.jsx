import Boton from './Boton';
import Modal from './Modal';

export default function DialogoConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Eliminar',
  textoCancelar = 'Cancelar',
  cargando = false,
  onConfirmar,
  onCancelar,
}) {
  return (
    <Modal abierto={abierto} onCerrar={onCancelar} titulo={titulo}>
      <p className="mb-6 text-sm text-slate-600">{mensaje}</p>
      <div className="flex justify-end gap-2">
        <Boton variante="secundario" onClick={onCancelar} disabled={cargando}>
          {textoCancelar}
        </Boton>
        <Boton variante="peligro" onClick={onConfirmar} cargando={cargando}>
          {textoConfirmar}
        </Boton>
      </div>
    </Modal>
  );
}
