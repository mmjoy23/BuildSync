import { z } from 'zod';

export const createPropertySchema = z.object({
  name: z.string({ required_error: 'Property name is required' }).min(2).max(100).trim(),
  address: z.string({ required_error: 'Address is required' }).min(3).trim(),
  yearBuilt: z.number().int().min(1800).max(2100).optional().nullable(),
  propertyType: z.string().min(2).max(50).optional().default('Residential'),
  ownerId: z.string().uuid().optional(),
});

export const updatePropertySchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  address: z.string().min(3).trim().optional(),
  yearBuilt: z.number().int().min(1800).max(2100).optional().nullable(),
  propertyType: z.string().min(2).max(50).optional(),
  status: z.string().min(2).max(20).optional(),
});
