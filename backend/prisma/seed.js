import clientePrisma from '../src/compartido/config/cliente-prisma.js';

// categorias predefinidas del sistema, visibles para todos los usuarios
const CATEGORIAS_PREDEFINIDAS = [
  { nombre: 'Vivienda', tipo: 'GASTO' },
  { nombre: 'Comida', tipo: 'GASTO' },
  { nombre: 'Transporte', tipo: 'GASTO' },
  { nombre: 'Salud', tipo: 'GASTO' },
  { nombre: 'Educación', tipo: 'GASTO' },
  { nombre: 'Ocio y entretenimiento', tipo: 'GASTO' },
  { nombre: 'Ropa y cuidado personal', tipo: 'GASTO' },
  { nombre: 'Seguros', tipo: 'GASTO' },
  { nombre: 'Deudas', tipo: 'GASTO' },
  { nombre: 'Mascotas', tipo: 'GASTO' },
  { nombre: 'Regalos y donaciones', tipo: 'GASTO' },
  { nombre: 'Otros gastos', tipo: 'GASTO' },
  { nombre: 'Salario', tipo: 'INGRESO' },
  { nombre: 'Freelance / Negocio propio', tipo: 'INGRESO' },
  { nombre: 'Inversiones', tipo: 'INGRESO' },
  { nombre: 'Regalos recibidos', tipo: 'INGRESO' },
  { nombre: 'Otros ingresos', tipo: 'INGRESO' },
];

// categoria de sistema para los aportes de metas: interna, no seleccionable, editable ni eliminable
const CATEGORIA_SISTEMA = { nombre: 'Ahorro / Meta', tipo: 'GASTO' };

// crea los registros iniciales de la base de datos (idempotente -> los existentes no se duplican)
async function main() {
  const hayPredefinidas = await clientePrisma.categoria.count({
    where: { esPredefinida: true, esSistema: false },
  });

  if (hayPredefinidas > 0) {
    console.log('Las categorias predefinidas ya existen');
  } else {
    await clientePrisma.categoria.createMany({
      data: CATEGORIAS_PREDEFINIDAS.map((categoria) => ({ ...categoria, esPredefinida: true })),
    });
    console.log('Categorias predefinidas creadas');
  }

  const haySistema = await clientePrisma.categoria.findFirst({ where: { esSistema: true } });

  if (haySistema) {
    console.log('La categoria de sistema ya existe');
  } else {
    await clientePrisma.categoria.create({
      data: { ...CATEGORIA_SISTEMA, esPredefinida: true, esSistema: true },
    });
    console.log('Categoria de sistema creada: Ahorro / Meta');
  }
}

main()
  .then(async () => {
    await clientePrisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await clientePrisma.$disconnect();
    process.exit(1);
  });
