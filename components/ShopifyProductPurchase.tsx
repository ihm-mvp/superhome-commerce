
"use client";

import { useState } from "react";

type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  sku: string | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: {
    amount: string;
    currencyCode: string;
  };
};

type Props = {
  variants: ShopifyVariant[];
};

export default function ShopifyProductPurchase({
  variants,
}: Props) {
  const initialVariant =
    variants.find((variant) => variant.availableForSale) ||
    variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariant?.id || ""
  );

  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  );

  async function buyNow() {
    if (!selectedVariant || !selectedVariant.availableForSale) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/shopify-test/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.checkoutUrl) {
        throw new Error(
          result.error || "Unable to create checkout"
        );
      }

      window.location.href = result.checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );

      setBusy(false);
    }
  }

  if (!variants.length) {
    return (
      <p className="text-sm text-red-600">
        No product options available.
      </p >
    );
  }

  return (
    <div className="space-y-4 border-t pt-5">

      {/* ===== Variant Selection ===== */}

      <div className="space-y-2">

        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          Select Option
        </h2>

        <select
          className="w-full border rounded-lg px-3 py-3 text-sm bg-white"
          value={selectedVariantId}
          onChange={(event) => {
            setSelectedVariantId(event.target.value);
            setQuantity(1);
            setError("");
          }}
          disabled={busy}
        >
          {variants.map((variant) => {
            const optionLabel =
              variant.selectedOptions
                .map((option) => `${option.name}: ${option.value}`)
                .join(" / ") || variant.title;

            return (
              <option
                key={variant.id}
                value={variant.id}
                disabled={!variant.availableForSale}
              >
                {optionLabel}
                {!variant.availableForSale
                  ? " - Sold Out"
                  : ""}
              </option>
            );
          })}
        </select>

      </div>

      {/* ===== Selected Variant ===== */}

      {selectedVariant && (
        <>
          <div className="text-2xl font-semibold">
            {new Intl.NumberFormat("en-NZ", {
              style: "currency",
              currency: selectedVariant.price.currencyCode,
            }).format(Number(selectedVariant.price.amount))}
          </div>

          <div className="text-sm text-gray-500">
            {selectedVariant.availableForSale
              ? "Available for sale"
              : "Currently unavailable"}
          </div>

          {selectedVariant.sku && (
            <div className="text-xs text-gray-400">
              Variant SKU: {selectedVariant.sku}
            </div>
          )}

          {/* ===== Quantity ===== */}

          {selectedVariant.availableForSale && (
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

              {/* ===== Buy Now ===== */}

              <button
                type="button"
                onClick={buyNow}
                disabled={busy}
                className="w-full rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
              >
                {busy
                  ? "Preparing checkout..."
                  : "Buy Now"}
              </button>
            </>
          )}
        </>
      )}

{/* ===== Error ===== */}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p >
      )}

    </div>
  );
}