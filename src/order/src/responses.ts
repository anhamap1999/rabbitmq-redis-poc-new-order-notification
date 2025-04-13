export class HttpResponse<T = unknown> {
  public statusCode: number;
  public data?: T;
  public error?: string;
  public errors?: unknown[];

  constructor({
    statusCode = 200,
    data,
    error,
    errors,
  }: {
    statusCode?: number;
    data?: T;
    error?: string;
    errors?: unknown[]
  }) {
    this.statusCode = statusCode;
    this.data = data;
    this.error = error;
    this.errors = errors;
  }
}
