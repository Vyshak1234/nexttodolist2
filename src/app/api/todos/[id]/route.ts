import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type TodoRow = { id: number; text: string };

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    // await the params using Next.js 15 dynamic route convention
    const { id } = await context.params;
    const idNum = Number(id);

    if (!Number.isInteger(idNum)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await query<TodoRow>(
      "DELETE FROM todos WHERE id = $1 RETURNING id, text",
      [idNum]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
