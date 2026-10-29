import { NextResponse } from "next/server";
import { shopifyAdminFetch } from "@/lib/shopify-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await shopifyAdminFetch<{
      shop: {
        name: string;
        myshopify_domain: string;
      };
    }>("shop.json");

    return NextResponse.json({
      success: true,
      shop: result.shop,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Shopify Admin API authorization failed",
      },
      { status: 500 }
    );
  }
}