"use client";

import { useState } from "react";

type Props = {
  variantId: string;
  availableForSale: boolean;
  price: string;
  currencyCode: string;
};

export default function ShopifyTestPurchase({
  variantId,
  availableForSale,
  price,
  currencyCode,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function buyNow() {
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/shopify-test/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId,
          quantity,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.checkoutUrl) {
        throw new Error(result.error || "Unable to create checkout");
      }

      window.location.href = result.checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 border-t pt-5">
      <div className="text-2xl font-semibold">
        {new Intl.NumberFormat("en-NZ", {
          style: "currency",
          currency: currencyCode,
        }).format(Number(price))}
      </div>

      <div className="text-sm text-gray-500">
        {availableForSale ? "Available for sale" : "Currently unavailable"}
      </div>

      {availableForSale && (
        <>
          <label className="flex items-center gap-3 text-sm">
            Quantity
            <select
              className="border rounded-lg px-3 py-2"
              value={quantity}
              onChange={(event) =>
                setQuantity(Number(event.target.value))
              }
              disabled={busy}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={buyNow}
            disabled={busy}
            className="w-full rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {busy ? "Preparing checkout..." : "Buy Now"}
          </button>
        </>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p > 
      )}

      <p className="text-xs text-gray-500">
        Checkout and order processing are securely handled by Shopify.
      </p >
    </div>
  );
}