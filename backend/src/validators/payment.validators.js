import { z } from 'zod';

// ---------- Shared helpers ----------

const decimalAmountSchema = z
  .number({
    required_error: 'amount is required',
    invalid_type_error: 'amount must be a number',
  })
  .positive('amount must be a positive number')
  .refine((val) => Number.isFinite(val), 'amount must be a finite number')
  .refine((val) => {
    const str = val.toString();
    const parts = str.split('.');
    if (parts[0].replace('-', '').length > 8) return false;
    if (parts[1] && parts[1].length > 2) return false;
    return true;
  }, 'amount must have at most 8 integer digits and 2 decimal places');

// ---------- POST /api/payments ----------

export const createPaymentSchema = z
  .object({
    billId: z.string({ required_error: 'billId is required' }).uuid('billId must be a valid UUID'),
    amount: decimalAmountSchema,
    method: z.enum(['BKASH', 'NAGAD', 'CASH', 'BANK_TRANSFER'], {
      required_error: 'method is required',
      invalid_type_error: 'method must be one of BKASH, NAGAD, CASH, BANK_TRANSFER',
    }),
    transactionId: z
      .string()
      .trim()
      .min(1, 'transactionId cannot be an empty string')
      .max(255, 'transactionId must be 255 characters or fewer')
      .optional(),
  })
  .superRefine((data, ctx) => {
    const digitalMethods = ['BKASH', 'NAGAD'];
    if (digitalMethods.includes(data.method) && !data.transactionId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['transactionId'],
        message: `transactionId is required for ${data.method} payments`,
      });
    }
  });

// ---------- GET /api/payments query ----------

export const getPaymentsQuerySchema = z.object({
  billId: z.string().uuid('billId must be a valid UUID').optional(),
  tenantId: z.string().uuid('tenantId must be a valid UUID').optional(),
  propertyId: z.string().uuid('propertyId must be a valid UUID').optional(),
  status: z.enum(['PENDING', 'VERIFIED', 'FAILED']).optional(),
  method: z.enum(['BKASH', 'NAGAD', 'CASH', 'BANK_TRANSFER']).optional(),
});
