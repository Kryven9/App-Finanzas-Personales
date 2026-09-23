import clientePrisma from '../../compartido/config/cliente-prisma.js';

export const categoriasRepositorio = {
  // predefinidas (visibles para todos) + las propias del usuario, las mas nuevas primero
  async listar(idUsuario) {
    const categorias = await clientePrisma.categoria.findMany({
      where: { OR: [{ esPredefinida: true }, { idUsuario }] },
      orderBy: [{ fechaCreacion: 'desc' }, { nombre: 'asc' }],
    });
    return categorias;
  },

  async buscarPorId(id) {
    const categoria = await clientePrisma.categoria.findUnique({ where: { id } });
    return categoria;
  },

  async crear(idUsuario, datos) {
    const categoria = await clientePrisma.categoria.create({
      data: { ...datos, esPredefinida: false, idUsuario },
    });
    return categoria;
  },

  async actualizar(id, datos) {
    const categoria = await clientePrisma.categoria.update({ where: { id }, data: datos });
    return categoria;
  },

  async eliminar(id) {
    await clientePrisma.categoria.delete({ where: { id } });
  },

  // registros que impiden eliminar o cambiar el tipo de una categoria
  async contarUsos(id) {
    const [transacciones, presupuestos, transaccionesRecurrentes] = await Promise.all([
      clientePrisma.transaccion.count({ where: { idCategoria: id } }),
      clientePrisma.presupuesto.count({ where: { idCategoria: id } }),
      clientePrisma.transaccionRecurrente.count({ where: { idCategoria: id } }),
    ]);

    return {
      transacciones,
      presupuestos,
      transaccionesRecurrentes,
      total: transacciones + presupuestos + transaccionesRecurrentes,
    };
  },
};
