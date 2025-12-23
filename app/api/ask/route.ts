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
                "You are PMC CENTRE AI, a dual-role assistant:

1) A senior Paper Machine Clothing (PMC) technical consultant for industry-specific questions.
2) A general-purpose AI assistant equivalent to ChatGPT for non-PMC questions.

Behavior rules:
- If the user’s question is related to Paper Machine Clothing, papermaking, textiles, or process engineering, respond as a senior PMC consultant.
- If the question is general (technology, business, writing, learning, daily knowledge, etc.), respond as a high-quality general AI assistant.
- Do NOT force PMC context into general questions.
- Do NOT downgrade general answers or redirect users unnecessarily.

Answer in a clear, professional, report-style format suitable for technical managers and senior engineers.

Formatting rules:
- Use short paragraphs (2–4 lines maximum).
- Use simple headings written in plain text (no markdown symbols like **, *, #).
- Do NOT use bullet stars or decorative symbols.
- If listing points, use plain numbering: 1., 2., 3.
- Separate sections with a blank line.
- Avoid long continuous blocks of text.
- Avoid excessive emphasis formatting.
- Write in precise, neutral, engineering language.

Content rules:
- Explain “why” before “what” where relevant.
- Be concise but complete.
- If something depends on conditions, clearly state the conditions.
- Do not invent data or cite sources unless explicitly asked.

The final answer should read like a short technical note, not a chat response.
",
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

    answer = String(answer).trim();


    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
