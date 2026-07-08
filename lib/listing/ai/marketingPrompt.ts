// lib/listing/ai/marketingPrompt.ts

export function buildMarketingPrompt(
  listing: any
) {

  return `

You are a senior residential property marketing strategist in New Zealand.

Generate ONE complete set of marketing assets for ONE listing.

==================================================
SCENE 1
Why This Property
==================================================

You are NOT writing a property description.

You are writing ONE section called:

"Why This Property"

for a mobile property landing page.

REAL WORLD CONTEXT

A buyer has already:

• seen a WeChat post, Moments post or QR code
• decided to click
• opened the mobile landing page

On this page the buyer has ALREADY seen:

• Hero photos
• Asking price
• Property address
• Bedrooms
• Bathrooms
• Garages
• Floor area
• Land area
• Open Home information

DO NOT repeat any information that is already shown.

YOUR JOB

Answer ONE question only:

"Why is this property worth inspecting?"

Not

"What does this property have?"

Each point should help the buyer understand
the value of this home rather than repeat facts.

Think like an experienced New Zealand real estate
agent talking to a serious buyer during an Open Home.

GOOD EXAMPLES

✓ Family-friendly layout

✓ Easy everyday living

✓ Excellent natural light

✓ Indoor-outdoor lifestyle

✓ Ready to move in

✓ Great school location

✓ Quiet established neighbourhood

✓ Flexible spaces for growing families

✓ Practical modern kitchen

✓ Ideal for long-term owner occupiers

BAD EXAMPLES

✗ Floor area

✗ Land area

✗ Bedrooms

✗ Bathrooms

✗ Garages

✗ Asking price

Those facts are already displayed elsewhere.

Requirements

Generate EXACTLY FIVE highlights.

Each highlight contains:

• icon
• zh
• en

Chinese

Maximum 18 Chinese characters.

English

Maximum 10 words.

Write naturally.

No marketing clichés.

Do not invent facts.

Do not exaggerate.

If the listing description does not support a point,
do not generate it.

==================================================
SCENE 2
WeChat Caption
==================================================

Requirements

- Chinese only.
- 100-150 Chinese characters.
- Suitable for WeChat Moments.
- Encourage readers to scan the QR Code or learn more.

==================================================
SCENE 3
WeChat Article
==================================================

Requirements

- Chinese only.
- Around 800-1200 Chinese characters.
- Do NOT translate the listing description.
- Write for Chinese buyers in New Zealand.
- Explain why this property deserves attention.
- Introduce lifestyle, suitable buyers and key selling points naturally.
- End with Open Home information if available.

==================================================
PROPERTY INFORMATION
==================================================

Address:
${listing.address}

Headline:
${listing.headline}

Description:
${listing.trademe_description}

Property Type:
${listing.property_type}

Price:
${listing.price}

Bedrooms:
${listing.bedrooms}

Bathrooms:
${listing.bathrooms}

Garages:
${listing.garages}

Floor Area:
${listing.floor_area}

Land Area:
${listing.land_area}

Open Homes:
${JSON.stringify(
  listing.openHomes || [],
  null,
  2
)}

==================================================
RETURN JSON ONLY
==================================================

{
  "slug_highlights":[
    {
      "icon":"☀️",
      "zh":"...",
      "en":"..."
    },
    {
      "icon":"🏡",
      "zh":"...",
      "en":"..."
    },
    {
      "icon":"🎓",
      "zh":"...",
      "en":"..."
    },
    {
      "icon":"🛍️",
      "zh":"...",
      "en":"..."
    },
    {
      "icon":"🔑",
      "zh":"...",
      "en":"..."
    }
  ],

  "wechat_caption":"...",

  "wechat_article":"..."

}

`

}