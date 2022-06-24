type RequestMethod = "get" | "post" | "put" | "delete";

export const queryBuilder =
  (
    relativeBackendUrl: string,
    method: RequestMethod,
    requestBody: Record<string, any>,
    requestHeaders: Record<string, any> = {},
    config: Record<string, any> = {}
  ) =>
  async () => {
    let headers, body;

    if (method !== "get") {
      headers = {
        "Content-Type": "application/json",
      };
      body = JSON.stringify(requestBody);
    }

    headers = {
      ...headers,
      ...requestHeaders,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${relativeBackendUrl}`,
      {
        method,
        headers,
        body,
        credentials: "include",
        ...config,
      }
    );

    return res.json();
  };
