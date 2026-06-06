import "server-only"
import fs from "fs/promises"
import path from "path"
import type { Data } from "@measured/puck"

// File-based CMS store. The Puck editor saves the document here via POST /api/puck,
// and the storefront (page + layout) reads it fresh on every request, so editor
// changes reflect live. Swap this module for a DB / Medusa-backed store later
// without touching callers.
const DATA_FILE = path.join(process.cwd(), "src", "puck", "data", "home.json")

const EMPTY: Data = {
  root: { props: {} },
  content: [],
  zones: {},
} as unknown as Data

export async function loadPuckData(): Promise<Data> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(raw) as Data
  } catch {
    return EMPTY
  }
}

export async function savePuckData(data: Data): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
}
