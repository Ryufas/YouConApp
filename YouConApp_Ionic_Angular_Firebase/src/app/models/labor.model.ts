export type TipoPago = 'DiaCompleto' | 'PorHora' | 'PorUnidad';

export interface Labor {
  id?: string;
  fecha: Date;
  trabajadorId: string;
  tipoPago: TipoPago;
  montoDia?: number;
  horasTrabajadas?: number;
  cantidadUnidades?: number;
  valorPorUnidad?: number;
  total: number;
  cultivo: string;
  descripcion: string;
  createdAt: Date;
  updatedAt: Date;
}