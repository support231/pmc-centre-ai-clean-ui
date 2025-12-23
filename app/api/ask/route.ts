import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-5.2",
          messages: [
            {
              role: "system",
              content:
                "You are PMC CENTRE AI, a professional Paper Machine Clothing technical assistant.",
            },
            {
              role: "user",
              content: question,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let answer = data?.choices?.[0]?.message?.content ?? "";

    // Clean ChatKit / retrieval junk tokens
    answer = answer
      .replace(//g, "")
      .replace(//g, "")
      .trim();

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
