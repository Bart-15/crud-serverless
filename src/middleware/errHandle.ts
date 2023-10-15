import { z } from 'zod';
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    body: Record<string, unknown> = {}
  ) {
    super(JSON.stringify(body));
  }
}

const headers = {
  'content-type': 'application/json',
};

export function handleError(error: unknown) {
  if (error instanceof z.ZodError) {
    const errMessages = error.issues.map(issue => issue);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        errors: errMessages,
        allErr: error
      }),
    };
  }

  if (error instanceof SyntaxError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Invalid request body format : "${error.message}"` }),
    };
  }

  if (error instanceof HttpError) {
    return {
      statusCode: error.statusCode,
      headers,
      body: error.message,
    };
  }

  throw error;
}
