import app from './app.js';
import { entorno } from './compartido/config/entorno.js';

app.listen(entorno.puerto, () => {
  console.log(`Servidor corriendo en el puerto ${entorno.puerto}`);
});
