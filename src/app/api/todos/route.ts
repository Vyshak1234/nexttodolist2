import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type TodoRow = { id: number; text: string };

export async function GET() {
  try {
    const result = await query<TodoRow>("SELECT * FROM todos ORDER BY id DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { text?: string };
    const text = body.text?.trim();
    if (!text) {
      return NextResponse.json({ error: "Todo text is required" }, { status: 400 });
    }

    const result = await query<TodoRow>(
      "INSERT INTO todos (text) VALUES ($1) RETURNING id, text",
      [text]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
