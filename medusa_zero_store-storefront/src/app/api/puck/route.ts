import { NextRequest, NextResponse } from "next/server"
import { loadPuckData, savePuckData } from "@lib/puck/load"

// Always run dynamically so reads/writes hit the file, never a cached build.
export const dynamic = "force-dynamic"

export async function GET() {
  const data = await loadPuckData()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    await savePuckData(data)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 400 }
    )
  }
}
