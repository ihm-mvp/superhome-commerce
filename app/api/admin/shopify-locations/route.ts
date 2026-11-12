
import { shopifyProductSyncGraphQL } from "@/lib/shopify-product-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await shopifyProductSyncGraphQL<{
      locations: {
        nodes: {
          id: string;
          name: string;
          isActive: boolean;
        }[];
      };
    }>(
      `
        query GetLocations {
          locations(first: 50) {
            nodes {
              id
              name
              isActive
            }
          }
        }
      `
    );

    return Response.json(result.locations.nodes);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve Shopify locations",
      },
      { status: 500 }
    );
  }
}