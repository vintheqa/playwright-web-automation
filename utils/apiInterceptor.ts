import { Page, Request, Response, Route, expect } from "@playwright/test";

export interface InterceptedCall {
  request: Request;
  response: Response;
  body: Record<string, unknown>;
}

export interface InterceptOptions {
  method?: string;
  status?: number | ((status: number) => boolean);
  body?: Record<string, unknown>;
}

/**
 * Waits for a network response matching the URL pattern and returns the
 * request, response, and parsed JSON body. Optionally asserts the HTTP
 * method, response status code, and/or partial response body.
 */
export async function interceptResponse(
  page: Page,
  urlPattern: string | RegExp,
  options: InterceptOptions = {}
): Promise<InterceptedCall> {
  const response = await page.waitForResponse(urlPattern);
  const request = response.request();
  const body = await response.json() as Record<string, unknown>;

  if (options.method) {
    expect(request.method(), `Expected request method to be ${options.method}`).toBe(options.method.toUpperCase());
  }

  if (options.status !== undefined) {
    const actualStatus = response.status();
    if (typeof options.status === "function") {
      expect(options.status(actualStatus), `Response status ${actualStatus} did not satisfy condition`).toBe(true);
    } else {
      expect(actualStatus, `Expected response status to be ${options.status}`).toBe(options.status);
    }
  }

  if (options.body !== undefined) {
    expect(body, `Expected response body to match`).toMatchObject(options.body);
  }

  return { request, response, body };
}

/**
 * Mocks an API route with a custom JSON payload and status code.
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  body: object,
  status = 200
): Promise<void> {
  await page.route(urlPattern, (route: Route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    })
  );
}

/**
 * Aborts all requests matching the URL pattern (e.g. to simulate network errors).
 */
export async function abortApiRequest(
  page: Page,
  urlPattern: string | RegExp
): Promise<void> {
  await page.route(urlPattern, (route: Route) => route.abort());
}
