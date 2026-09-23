import { CircleDollarSign, CreditCard, Landmark, Wallet } from 'lucide-react';

// tipos de cuenta con su etiqueta e icono
export const TIPOS_CUENTA = [
  { valor: 'EFECTIVO', etiqueta: 'Efectivo', icono: Wallet },
  { valor: 'BANCO', etiqueta: 'Banco', icono: Landmark },
  { valor: 'TARJETA_CREDITO', etiqueta: 'Tarjeta de credito', icono: CreditCard },
  { valor: 'OTRO', etiqueta: 'Otro', icono: CircleDollarSign },
];

export function obtenerTipoCuenta(valor) {
  return TIPOS_CUENTA.find((tipo) => tipo.valor === valor);
}
