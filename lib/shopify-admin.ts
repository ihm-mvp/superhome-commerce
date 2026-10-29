import "server-only";

const SHOPIFY_API_VERSION = "2026-10";
const TOKEN_REFRESH_BUFFER_SECONDS = 300;

type TokenResponse = {
  access_token: string;
  scope: string;
  expires_in: number;
};

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAdminAccessToken(): Promise<string> {
  // 在当前服务端实例中复用有效 Token
  if (
    cachedToken &&
    Date.now() < tokenExpiresAt - TOKEN_REFRESH_BUFFER_SECONDS * 1000
  ) {
    return cachedToken;
  }

  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!shopDomain || !clientId || !clientSecret) {
    throw new Error("Missing Shopify Admin API environment variables");
  }

  const response = await fetch(
    `https://${shopDomain}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    // 不记录 Client Secret 或 Token
    console.error(
      "Shopify token request failed:",
      response.status,
      await response.text()
    );

    throw new Error("Unable to obtain Shopify Admin API access token");
  }

  const data = (await response.json()) as TokenResponse;

  if (!data.access_token || !data.expires_in) {
    throw new Error("Invalid Shopify token response");
  }

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  return cachedToken;
}

export async function shopifyAdminFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = await getAdminAccessToken();
  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;

  if (!shopDomain) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN");
  }

  const normalizedPath = path.replace(/^\/+/, "");

  const response = await fetch(
    `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/${normalizedPath}`,
    {
      ...init,
      headers: {
        ...init.headers,
        "X-Shopify-Access-Token": token,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("Shopify Admin API request failed:", response.status);

    throw new Error(
      `Shopify Admin API request failed with status ${response.status}`
    );
  }

  return (await response.json()) as T;
}