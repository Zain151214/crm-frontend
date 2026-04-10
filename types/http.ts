export type ApiErrorBody = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

export type HttpJsonRequestOptions = RequestInit & {
  json?: unknown;
};
