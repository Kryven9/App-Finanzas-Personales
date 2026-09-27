import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CUADRICULA, EJE_MONEDA, EJE_TIEMPO, formatearTooltip } from './elementosGrafico';

// dos lineas por mes -> ingresos y gastos en paralelo
export default function GraficoEvolucion({ datos }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={datos} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid {...CUADRICULA} />
        <XAxis {...EJE_TIEMPO} />
        <YAxis {...EJE_MONEDA} />
        <Tooltip
          formatter={formatearTooltip}
          cursor={{ stroke: '#BEC2CC' }}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="ingresos"
          name="Ingresos"
          stroke="#925BF0"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="gastos"
          name="Gastos"
          stroke="#E00D3C"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
