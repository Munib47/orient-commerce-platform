import { Metadata } from "next"

import { Render } from "@measured/puck"
import { puckConfig } from "@/puck/config"
import { loadPuckData } from "@lib/puck/load"

// Read the CMS document fresh on every request so Puck editor changes go live.
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Orient",
  description: "Orient — headless storefront powered by Medusa and Next.js.",
}

export default async function Home() {
  const data = await loadPuckData()

  return <Render config={puckConfig} data={data} />
}
