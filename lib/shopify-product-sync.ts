import "server-only";

const SHOPIFY_API_VERSION = "2026-10";
const TOKEN_REFRESH_BUFFER_SECONDS = 300;

type TokenResponse = {
  access_token: string;
  scope: string;
  expires_in: number;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
  }>;
};

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getProductSyncToken(): Promise<string> {
  if (
    cachedToken &&
    Date.now() <
      tokenExpiresAt -
        TOKEN_REFRESH_BUFFER_SECONDS * 1000
  ) {
    return cachedToken;
  }

  const shopDomain =
    process.env.SHOPIFY_STORE_DOMAIN;

  const clientId =
    process.env.SHOPIFY_CLIENT_ID;

  const clientSecret =
    process.env.SHOPIFY_CLIENT_SECRET;

  if (
    !shopDomain ||
    !clientId ||
    !clientSecret
  ) {
    throw new Error(
      "Missing Shopify Product Sync environment variables"
    );
  }

  const response = await fetch(
    `https://${shopDomain}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
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
    console.error(
      "[Shopify Product Sync] Token request failed:",
      response.status
    );

    throw new Error(
      "Unable to obtain Shopify Product Sync token"
    );
  }

  const result =
    (await response.json()) as TokenResponse;

  if (
    !result.access_token ||
    !result.expires_in
  ) {
    throw new Error(
      "Invalid Shopify Product Sync token response"
    );
  }

  cachedToken = result.access_token;

  tokenExpiresAt =
    Date.now() +
    result.expires_in * 1000;

  return cachedToken;
}

export async function shopifyProductSyncGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const shopDomain =
    process.env.SHOPIFY_STORE_DOMAIN;

  if (!shopDomain) {
    throw new Error(
      "Missing SHOPIFY_STORE_DOMAIN"
    );
  }

  const token =
    await getProductSyncToken();

  const response = await fetch(
    `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error(
      "[Shopify Product Sync] GraphQL HTTP error:",
      response.status
    );

    throw new Error(
      `Shopify GraphQL request failed: HTTP ${response.status}`
    );
  }

  const result =
    (await response.json()) as GraphQLResponse<T>;

  if (result.errors?.length) {
    const message = result.errors
      .map((error) => error.message)
      .join("; ");

    console.error(
      "[Shopify Product Sync] GraphQL errors:",
      message
    );

    throw new Error(
      `Shopify GraphQL error: ${message}`
    );
  }

  if (!result.data) {
    throw new Error(
      "Shopify GraphQL response contains no data"
    );
  }

  return result.data;
}