const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN!;
const SHOPIFY_API_VERSION =
  process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-10";

export async function shopifyQuery<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    throw new Error("Missing Shopify environment variables");
  }

  const response = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok || result.errors?.length) {
    console.error("Shopify Storefront API error", {
      status: response.status,
      errors: result.errors,
    });

    throw new Error("Unable to load Shopify product");
  }

  return result.data as T;
}