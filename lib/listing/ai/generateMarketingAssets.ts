// lib/listing/ai/generateMarketingAssets.ts

export async function generateMarketingAssets(
  listing: any
) {

  if (
    !process.env.OPENAI_API_KEY
  ) {

    throw new Error(
      "OPENAI_API_KEY not configured"
    )

  }

  const {
    default: OpenAI,
  } = await import("openai")

  const client = new OpenAI({

    apiKey:
      process.env.OPENAI_API_KEY,

  })

  const prompt = `

You are an experienced New Zealand residential property marketing specialist.

Based ONLY on the listing information provided below, generate ONE complete set of marketing assets.

Rules:

- Never invent facts.
- Never exaggerate.
- Do not use words such as luxury, perfect, amazing or dream home.
- Chinese should read naturally for New Zealand Chinese buyers.
- Return JSON only.

Return Format:

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

Requirements

slug_highlights

- Exactly 5 items.
- Chinese <= 18 Chinese characters.
- English <= 10 words.
- Focus on buyer value.
- Suitable for a mobile landing page.

wechat_caption

- Chinese only.
- 100-150 Chinese characters.
- Suitable for WeChat Moments.
- Encourage readers to scan the QR Code or learn more.

wechat_article

- Chinese only.
- Around 800-1200 Chinese characters.
- Do NOT translate the listing description.
- Write for Chinese buyers in New Zealand.
- Explain why this property deserves attention.
- Introduce lifestyle, suitable buyers and key selling points naturally.
- End with Open Home information if available.

Property Information

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

`

  const response =
    await client.chat.completions.create({

      model:
        "gpt-5.5",

      response_format: {

        type:
          "json_object",

      },

      messages: [

        {

          role: "user",

          content:
            prompt,

        },

      ],

    })

  return JSON.parse(

    response
      .choices[0]
      .message
      .content || "{}"

  )

}