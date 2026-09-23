import clientePrisma from '../src/compartido/config/cliente-prisma.js';
import { categoriasRepositorio } from '../src/modulos/categorias/categorias.repositorio.js';

// categorias predefinidas, visibles para todos los usuarios
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

// idempotente -> solo crear las predefinidas si aun no existen
async function main() {
  const existentes = await clientePrisma.categoria.count({ where: { esPredefinida: true } });

  if (existentes > 0) {
    console.log('Las categorias predefinidas ya existen');
    return;
  }

  await clientePrisma.categoria.createMany({
    data: CATEGORIAS_PREDEFINIDAS.map((categoria) => ({ ...categoria, esPredefinida: true })),
  });
  console.log('Categorias predefinidas creadas');
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
