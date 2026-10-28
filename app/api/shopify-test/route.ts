import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION;

  if (!domain || !token || !version) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing Shopify environment variables",
        configured: {
          domain: Boolean(domain),
          token: Boolean(token),
          version: Boolean(version),
        },
      },
      { status: 500 }
    );
  }

  const query = `
    query TestShopifyConnection {
      shop {
        name
      }
      products(first: 5) {
        nodes {
          id
          title
          handle
          availableForSale
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${domain}/api/${version}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Shopify-Storefront-Private-Token": token,
        },
        body: JSON.stringify({ query }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || result.errors) {
      console.error("Shopify Storefront API error", {
        status: response.status,
        errors: result.errors,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Shopify Storefront API request failed",
          status: response.status,
          details: result.errors?.map(
            (item: { message?: string }) => item.message
          ),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      shop: result.data.shop.name,
      productCount: result.data.products.nodes.length,
      products: result.data.products.nodes,
    });
  } catch (error) {
    console.error("Shopify connection error", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to connect to Shopify",
      },
      { status: 502 }
    );
  }
}