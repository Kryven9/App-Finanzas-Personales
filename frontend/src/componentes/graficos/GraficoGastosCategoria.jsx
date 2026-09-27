import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatearTooltip } from './elementosGrafico';

// barras horizontales -> una por categoria, llega ordenada de mayor a menor gasto
export default function GraficoGastosCategoria({ datos }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(240, datos.length * 48)}>
      <BarChart data={datos} layout="vertical" margin={{ top: 8, right: 72, bottom: 8, left: 8 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="categoriaNombre"
          width={150}
          interval={0}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#3C3C52' }}
        />
        <Tooltip cursor={{ fill: 'rgba(16, 26, 39, 0.03)' }} formatter={formatearTooltip} />
        <Bar dataKey="total" name="Gasto" fill="#925BF0" radius={[0, 6, 6, 0]} barSize={22}>
          <LabelList
            dataKey="total"
            position="right"
            formatter={formatearTooltip}
            style={{ fontSize: 12, fill: '#292938', fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
