
import { z } from 'zod';

export const propertySchema = z.object({
  address: z.string().min(1, { message: 'Endereço é obrigatório' }),
  purpose: z.string().min(1, { message: 'Finalidade é obrigatória' }),
  owner: z.string().min(1, { message: 'Proprietário é obrigatório' }),
  type: z.string().min(1, { message: 'Tipo de imóvel é obrigatório' }),
  salePrice: z.string().optional(),
  rentalPrice: z.string().optional(),
  description: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
