import dotenv from 'dotenv';

dotenv.config();

export const entorno = {
  puerto: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
};

if (!entorno.jwtSecret) {
  throw new Error('JWT_SECRET no esta definido en las variables de entorno');
}
