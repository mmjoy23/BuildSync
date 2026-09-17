import { z } from 'zod';

const billItemTypeEnum = z.enum([
  'RENT',
  'ELECTRICITY',
  'WATER',
  'GAS',
  'SERVICE_CHARGE',
  'PARKING',
  'OTHER',
]);

const billItemSchema = z.object({
  type: billItemTypeEnum,
  description: z.string().trim().max(255).optional(),
  amount: z
    .number({
      required_error: 'Bill item amount is required',
      invalid_type_error: 'Bill item amount must be a number',
    })
    .nonnegative('Bill item amount must be non-negative')
    .refine((val) => Number.isFinite(val), 'Bill item amount must be a finite number')
    .refine((val) => {
      // Decimal(10,2) validation: max 99,999,999.99 and max 2 decimal places
      const decimalStr = val.toString();
      const parts = decimalStr.split('.');
      if (parts[0].replace('-', '').length > 8) return false;
      if (parts[1] && parts[1].length > 2) return false;
      return true;
    }, 'Amount must have at most 8 integer digits and 2 decimal places'),
});

export const createBillSchema = z.object({
  leaseId: z.string().uuid('Invalid lease ID format'),
  billingMonth: z
    .string({ required_error: 'billingMonth is required' })
    .trim()
    .regex(/^(19|20)\d\d-(0[1-9]|1[0-2])$/, 'billingMonth must be in YYYY-MM format'),
  dueDate: z
    .string({ required_error: 'dueDate is required' })
    .trim()
    .transform((val, ctx) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid dueDate format. Must be a valid date string (e.g. YYYY-MM-DD)',
        });
        return z.NEVER;
      }
      return date;
    }),
  items: z
    .array(billItemSchema, { required_error: 'items array is required' })
    .min(1, 'At least one bill item is required'),
});

export const getBillsQuerySchema = z.object({
  leaseId: z.string().uuid('Invalid leaseId format').optional(),
  propertyId: z.string().uuid('Invalid propertyId format').optional(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE']).optional(),
  billingMonth: z.string().regex(/^(19|20)\d\d-(0[1-9]|1[0-2])$/, 'billingMonth must be in YYYY-MM format').optional(),
});
