import { ZodError } from "zod";

export function parseZodErrors(error: ZodError): Record<string, string[]> {
  return error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = [];
    acc[field].push(issue.message);
    return acc;
  }, {} as Record<string, string[]>);
}
