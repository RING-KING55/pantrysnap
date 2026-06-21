import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// I highly recommend moving this to an .env.local file as process.env.GEMINI_API_KEY later!
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

export async function POST(req: Request) {
  try {
    const { image, people, cuisine } = await req.json()

    if (!image) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 })
    }

    // 1. Dynamically extract the exact image type (png, jpeg, webp) 
    // instead of hardcoding it, otherwise Gemini rejects it.
    const mimeTypeMatch = image.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
    
    // Clean up the base64 string incoming from the frontend canvas
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

    const prompt = `
      You are the backend vision engine for PantrySnap AI, acting as an expert chef and nutrition AI. 
      Analyze this user snapshot image.

      CRITICAL SECURITY RULE: If the image does not show an open fridge, a pantry, raw food ingredients, or grocery items, or if it shows something completely unhygienic/disgusting/non-food items (like feces, trash, electronics, random objects), you MUST reject it immediately.

      If rejected, return exactly this JSON format:
      {
        "rejected": true,
        "reason": "Please upload a valid picture of food items or an open fridge layout!"
      }

      If accepted, analyze the visible food items and generate EXACTLY 10 unique, highly diverse recipe alternatives matching these specifications:
      - Serve Target: ${people || 2} persons
      - Cuisine Style Preference: ${cuisine || 'Any'}

      Return strictly a valid JSON object matching this schema, with no markdown code blocks around it:
      {
        "rejected": false,
        "recipes": [
          {
            "name": "Recipe Title Here",
            "description": "Short appetizing description of the meal style.",
            "ingredients": "List of discovered ingredients used.",
            "instructions": [
              "Step 1: First instruction detail here.",
              "Step 2: Second instruction detail here."
            ]
          }
        ]
      }
    `

    // Call Gemini 2.5 Flash with multi-modal vision inputs
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // 2. Wrap BOTH the prompt and image explicitly in object parts
      contents: [
        { text: prompt },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    })

    // 3. Bruteforce strip Markdown blocks to protect JSON.parse()
    let rawText = response.text || '{}'
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim()

    const resultData = JSON.parse(rawText)

    if (resultData.rejected) {
      return NextResponse.json({ error: resultData.reason }, { status: 422 })
    }

    return NextResponse.json({ recipes: resultData.recipes })

  } catch (error) {
    console.error('Gemini Infra Layer Error:', error)
    return NextResponse.json({ error: 'Failed to parse visual textures safely' }, { status: 500 })
  }
}
