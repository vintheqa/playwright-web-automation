import { APIRequestContext, request } from "@playwright/test";

export interface ApiResponse<T = Record<string, unknown>> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export interface ApiConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Creates and manages an API client for making HTTP requests in tests.
 */
export class ApiClient {
  private context: APIRequestContext | null = null;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: ApiConfig = {}) {
    this.baseURL = config.baseURL || "";
    this.defaultHeaders = config.headers || {};
    this.timeout = config.timeout || 30000;
  }

  /**
   * Initialize the API context (call once per test).
   */
  async init(): Promise<void> {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: this.defaultHeaders,
      timeout: this.timeout,
    });
  }

  /**
   * Clean up the API context (call in test teardown).
   */
  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
    }
  }

  /**
   * Make a GET request.
   */
  async get<T = Record<string, unknown>>(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", url, undefined, headers);
  }

  /**
   * Make a POST request.
   */
  async post<T = Record<string, unknown>>(
    url: string,
    body?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", url, body, headers);
  }

  /**
   * Make a PUT request.
   */
  async put<T = Record<string, unknown>>(
    url: string,
    body?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", url, body, headers);
  }

  /**
   * Make a DELETE request.
   */
  async delete<T = Record<string, unknown>>(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", url, undefined, headers);
  }

  /**
   * Generic request method.
   */
  private async request<T = Record<string, unknown>>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    if (!this.context) {
      throw new Error("ApiClient not initialized. Call init() first.");
    }

    const mergedHeaders = { ...this.defaultHeaders, ...headers };
    const response = await this.context.fetch(url, {
      method,
      headers: mergedHeaders,
      data: body,
    });

    const data = (await response.json()) as T;
    const responseHeaders: Record<string, string> = {};
    response.headersArray().forEach(({ name, value }) => {
      responseHeaders[name] = value;
    });

    return {
      status: response.status(),
      data,
      headers: responseHeaders,
    };
  }
}

/**
 * Helper to authenticate and return auth token/session.
 */
export async function authenticateViaApi(
  apiClient: ApiClient,
  url: string,
  credentials: { username: string; password: string }
): Promise<string | Record<string, unknown>> {
  const response = await apiClient.post<Record<string, unknown>>(url, credentials);

  if (response.status !== 200) {
    throw new Error(`Authentication failed with status ${response.status}`);
  }

  // Adjust based on your API response structure
  // Could be a token, sessionId, or entire auth object
  const token = response.data.token as string | Record<string, unknown>;
  
  if (!token) {
    throw new Error("No token or auth data in response");
  }

  return token;
}
