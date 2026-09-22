import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';

// campo de contraseña con el boton para mostrar y ocultar el texto
export default function CampoContrasena({ etiqueta, id, name, value, onChange, error, ...resto }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        etiqueta={etiqueta}
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        error={error}
        {...resto}
      />
      <button
        type="button"
        onClick={() => setVisible((previo) => !previo)}
        className="absolute top-8.5 right-3 text-slate-400 transition-colors hover:text-slate-600"
        aria-label={
          visible ? `Ocultar ${etiqueta?.toLowerCase()}` : `Mostrar ${etiqueta?.toLowerCase()}`
        }
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
