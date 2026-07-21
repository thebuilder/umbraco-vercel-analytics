export interface ApiFailure {
  code?: string;
  detail?: string;
  status?: number;
}

export function apiFailure(error: unknown, responseStatus?: number): ApiFailure {
  const problem = typeof error === "object" && error !== null ? error as Record<string, unknown> : undefined;
  return {
    code: stringProperty(problem, "code"),
    detail: stringProperty(problem, "detail"),
    status: responseStatus ?? numberProperty(problem, "status"),
  };
}

function stringProperty(value: Record<string, unknown> | undefined, property: string): string | undefined {
  const candidate = value?.[property];
  return typeof candidate === "string" && candidate.trim() ? candidate : undefined;
}

function numberProperty(value: Record<string, unknown> | undefined, property: string): number | undefined {
  const candidate = Number(value?.[property]);
  return Number.isFinite(candidate) ? candidate : undefined;
}
