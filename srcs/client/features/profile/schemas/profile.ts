import { z } from 'zod';

export const userTypeEnum = z.enum(['一般社員', '新卒']);

export const profileSchema = z.object({
  username: z.string().min(1, '名前を入力してください'),
  bio: z.string().max(200, '紹介文は200文字以内で入力してください').optional(),
  department_id: z.number().nullable(),
  user_type: userTypeEnum.nullable(),
  allergies: z.array(z.string()),
  is_support_used: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type BaseUserType = z.infer<typeof userTypeEnum>;
