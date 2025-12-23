import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    const response = await fetch(
      `${process.env.PMC_BACKEND_URL}/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      }
    );

    const data = await response.json();
    const answer = String(data?.answer ?? "").trim();

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
