import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import TablaTransacciones from '../../Transacciones/componentes/TablaTransacciones';
import Tarjeta from '../../../componentes/comunes/Tarjeta';
import EnlaceSeccion from './EnlaceSeccion';

// ultimas transacciones sin filtros ni paginacion, la tabla completa esta en su pagina
export default function ActividadReciente({ transacciones, cargando }) {
  return (
    <Tarjeta
      titulo="Actividad reciente"
      acciones={<EnlaceSeccion ruta="/transacciones" texto="Ver todas" />}
    >
      {cargando ? (
        <Cargando />
      ) : transacciones.length === 0 ? (
        <EstadoVacio
          titulo="Aun no tienes transacciones"
          descripcion="Tus ultimas transacciones apareceran aqui"
        />
      ) : (
        <TablaTransacciones transacciones={transacciones} conBorde={false} />
      )}
    </Tarjeta>
  );
}
