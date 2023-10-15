import { object, string, TypeOf, number } from 'zod';

export const createUserSchema = object({
  userId: string().optional(),
  name: string().trim().min(1, { message: 'Name is required.' }),
  lastName: string().trim().min(1, { message: 'Lastname is required.' }),
  age: number().min(1, {message: 'Age is required'}).max(100, { message: "Age max limit is 100 only"}),
  avatar: string().optional(),
});

export type createUserInput = TypeOf<typeof createUserSchema>;
    