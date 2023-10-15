import { z, AnyZodObject } from 'zod';

const validateResource = <T>(schema: AnyZodObject, payload: unknown) => schema.parse(payload);

export default validateResource;
