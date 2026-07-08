// lib/listing/ai/generateMarketingAssets.ts

import { buildMarketingPrompt } from "./marketingPrompt"

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

  const prompt =
    buildMarketingPrompt(
      listing
    )

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

          role:
            "user",

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