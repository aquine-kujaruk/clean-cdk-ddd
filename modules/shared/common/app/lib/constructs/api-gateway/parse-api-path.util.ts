import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { z } from 'zod';

const PathSchema = z.string().regex(/^\/[a-zA-Z0-9-_\/{}/]*$/, 'Invalid API path format');

const InputSchema = z.object({
  raw: z.string(),
  method: z.nativeEnum(HttpMethod),
  path: PathSchema,
});

type ParsedPath = z.infer<typeof InputSchema>;

const parseHttpMethodAndPath = (input: string): ParsedPath => {
  const [methodStr, ...pathParts] = input.split(' ');
  const path = pathParts.join(' ');

  try {
    const method = z.nativeEnum(HttpMethod).parse(methodStr);
    return InputSchema.parse({ raw: input, method, path });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => {
          if (err.path.includes('method')) {
            return `Invalid HTTP method in "${input}": ${methodStr} is not a valid method`;
          } else if (err.path.includes('path')) {
            return `Invalid API path in "${input}": ${path} does not match the required format`;
          } else {
            return `Invalid format in "${input}": ${err.message}`;
          }
        })
        .join('; ');
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const parseApiPath = (path: string): ParsedPath => {
  try {
    return parseHttpMethodAndPath(path);
  } catch (error) {
    if (error instanceof Error) throw new Error(`Validation error: ${error.message}`);
    else throw new Error('Unknown error occurred');
  }
};
