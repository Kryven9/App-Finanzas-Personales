import {
  Bus,
  CircleEllipsis,
  CreditCard,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  PawPrint,
  ShieldCheck,
  Shirt,
  Tag,
  UtensilsCrossed,
} from 'lucide-react';

// iconos de las categorias predefinidas
const ICONOS_PREDEFINIDAS = {
  Vivienda: House,
  Comida: UtensilsCrossed,
  Transporte: Bus,
  Salud: HeartPulse,
  Educación: GraduationCap,
  'Ocio y entretenimiento': Gamepad2,
  'Ropa y cuidado personal': Shirt,
  Seguros: ShieldCheck,
  Deudas: CreditCard,
  Mascotas: PawPrint,
  'Regalos y donaciones': Gift,
  'Otros gastos': CircleEllipsis,
};

// las categorias propias comparten un icono generico
export function obtenerIconoCategoria(nombre, esPredefinida) {
  const icono = !esPredefinida ? Tag : (ICONOS_PREDEFINIDAS[nombre] ?? Tag);
  return { icono };
}
