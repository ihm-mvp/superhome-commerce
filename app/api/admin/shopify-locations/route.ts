import { shopifyProductSyncGraphQL } from "@/lib/shopify-product-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await shopifyProductSyncGraphQL<{
      publications: {
        nodes: {
          id: string;
          name: string;
        }[];
      };
    }>(
      `
        query GetPublications {
          publications(first: 50) {
            nodes {
              id
              name
            }
          }
        }
      `
    );

    return Response.json(result.publications.nodes);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve Shopify publications",
      },
      { status: 500 }
    );
  }
}