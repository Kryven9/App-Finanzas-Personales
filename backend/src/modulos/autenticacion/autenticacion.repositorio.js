import clientePrisma from '../../compartido/config/cliente-prisma.js';

export const autenticacionRepositorio = {
  async buscarPorCorreo(correo) {
    const usuario = await clientePrisma.usuario.findUnique({ where: { correo } });
    return usuario;
  },

  async buscarPorId(id) {
    const usuario = await clientePrisma.usuario.findUnique({ where: { id } });
    return usuario;
  },

  async crear(datos) {
    const usuario = await clientePrisma.usuario.create({ data: datos });
    return usuario;
  },

  async actualizar(id, datos) {
    const usuario = await clientePrisma.usuario.update({ where: { id }, data: datos });
    return usuario;
  },
};
