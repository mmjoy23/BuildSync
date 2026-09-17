import { z } from 'zod';

export const createLeaseSchema = z
  .object({
    unitId: z.string({ required_error: 'Unit ID is required' }).uuid('Invalid unit ID format'),
    tenantId: z.string({ required_error: 'Tenant ID is required' }).uuid('Invalid tenant ID format'),
    startDate: z
      .string({ required_error: 'Start date is required' })
      .transform((val) => new Date(val)),
    endDate: z
      .string()
      .transform((val) => new Date(val))
      .optional()
      .nullable(),
    agreedRent: z
      .union([z.number().positive(), z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid currency amount')])
      .transform((val) => String(val)),
    status: z.enum(['ACTIVE', 'TERMINATED', 'PENDING']).optional().default('ACTIVE'),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    }
  );

export const updateLeaseSchema = z
  .object({
    startDate: z
      .string()
      .transform((val) => new Date(val))
      .optional(),
    endDate: z
      .string()
      .transform((val) => new Date(val))
      .optional()
      .nullable(),
    agreedRent: z
      .union([z.number().positive(), z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid currency amount')])
      .transform((val) => String(val))
      .optional(),
    status: z.enum(['ACTIVE', 'TERMINATED', 'PENDING']).optional(),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    }
  );
