import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CUADRICULA, EJE_MONEDA, EJE_TIEMPO, formatearTooltip } from './elementosGrafico';

const VERDE = '#2BCF83';
const ROJO = '#E00D3C';

// una barra por mes con el neto del periodo -> verde si es positivo, rojo si fue negativo;
// compacto reduce la altura para el bloque del dashboard
export default function GraficoFlujoCaja({ datos, compacto = false }) {
  return (
    <ResponsiveContainer width="100%" height={compacto ? 200 : 300}>
      <BarChart data={datos} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid {...CUADRICULA} />
        <XAxis {...EJE_TIEMPO} />
        <YAxis {...EJE_MONEDA} />
        <Tooltip
          formatter={formatearTooltip}
          cursor={{ fill: 'rgba(16, 26, 39, 0.03)' }}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <ReferenceLine y={0} stroke="#BEC2CC" />
        <Bar dataKey="neto" name="Flujo de caja" barSize={28}>
          {datos.map((fila) => (
            <Cell
              key={`${fila.anio}-${fila.mes}`}
              fill={fila.neto >= 0 ? VERDE : ROJO}
              radius={fila.neto >= 0 ? [6, 6, 0, 0] : [0, 0, 6, 6]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
