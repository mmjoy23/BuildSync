import { z } from 'zod';

export const createUnitSchema = z.object({
  unitNumber: z.string({ required_error: 'Unit number is required' }).min(1).max(20).trim(),
  floorNumber: z.string({ required_error: 'Floor number is required' }).min(1).max(20).trim(),
  bedrooms: z.number().int().min(0).max(50).optional().nullable(),
  bathrooms: z.number().int().min(0).max(50).optional().nullable(),
  areaSqft: z.number().int().min(10).max(50000).optional().nullable(),
  status: z.enum(['OCCUPIED', 'VACANT', 'MAINTENANCE']).optional().default('VACANT'),
  baseRent: z
    .union([z.number().positive(), z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid currency amount')])
    .transform((val) => String(val)),
});

export const updateUnitSchema = z.object({
  unitNumber: z.string().min(1).max(20).trim().optional(),
  floorNumber: z.string().min(1).max(20).trim().optional(),
  bedrooms: z.number().int().min(0).max(50).optional().nullable(),
  bathrooms: z.number().int().min(0).max(50).optional().nullable(),
  areaSqft: z.number().int().min(10).max(50000).optional().nullable(),
  status: z.enum(['OCCUPIED', 'VACANT', 'MAINTENANCE']).optional(),
  baseRent: z
    .union([z.number().positive(), z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid currency amount')])
    .transform((val) => String(val))
    .optional(),
});
