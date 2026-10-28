import { NextResponse } from "next/server";
import { shopifyQuery } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CartCreateResult = {
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
    } | null;
    userErrors: {
      field: string[] | null;
      message: string;
    }[];
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const variantId = body.variantId;
    const quantity = Number(body.quantity);

    if (
      typeof variantId !== "string" ||
      !variantId.startsWith("gid://shopify/ProductVariant/") ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 5
    ) {
      return NextResponse.json(
        { error: "Invalid product variant or quantity" },
        { status: 400 }
      );
    }

    const result = await shopifyQuery<CartCreateResult>(
      `
        mutation CreateTestCart($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        input: {
          lines: [
            {
              merchandiseId: variantId,
              quantity,
            },
          ],
        },
      }
    );

    const { cart, userErrors } = result.cartCreate;

    if (userErrors.length || !cart?.checkoutUrl) {
      return NextResponse.json(
        {
          error:
            userErrors.map((item) => item.message).join("; ") ||
            "Unable to create Shopify checkout",
        },
        { status: 400 }
      );
    }

    const checkoutUrl = new URL(cart.checkoutUrl);

    if (
      checkoutUrl.protocol !== "https:" ||
      checkoutUrl.hostname !== process.env.SHOPIFY_STORE_DOMAIN
    ) {
      return NextResponse.json(
        { error: "Unexpected checkout destination" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      checkoutUrl: checkoutUrl.toString(),
    });
  } catch (error) {
    console.error("Shopify cart creation failed", error);

    return NextResponse.json(
      { error: "Unable to prepare Shopify checkout" },
      { status: 502 }
    );
  }
}