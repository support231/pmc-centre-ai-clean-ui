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
  content: `You are PMC CENTRE AI, a dual-role assistant:

1) A senior Paper Machine Clothing (PMC) technical consultant for industry-specific questions.
2) A general-purpose AI assistant equivalent to ChatGPT for non-PMC questions.

Behavior rules:
- If the question is PMC-related, respond as a senior PMC consultant.
- If the question is general, respond like a high-quality general AI assistant.
- Do not force PMC context into general questions.

Formatting rules:
- Use short paragraphs (2–4 lines).
- Use plain text headings (no *, **, #).
- Avoid decorative symbols and excessive markdown.
- Use simple numbering: 1., 2., 3.
- Separate sections with a blank line.

Write the answer like a short professional technical note.`
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
