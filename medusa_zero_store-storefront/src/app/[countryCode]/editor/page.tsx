"use client"

import { Puck, type Data } from "@measured/puck"
import "@measured/puck/puck.css"

import { puckConfig } from "@/puck/config"
import { useEffect, useState } from "react"

export default function EditorPage() {
  const [data, setData] = useState<Data | null>(null)

  // Load the current published document from the CMS store.
  useEffect(() => {
    fetch("/api/puck")
      .then((r) => r.json())
      .then((d) => setData(d as Data))
      .catch(() => setData({ content: [], root: { props: {} } } as unknown as Data))
  }, [])

  // Persist to the CMS store so changes go live on the storefront.
  const publish = async (newData: Data) => {
    const res = await fetch("/api/puck", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newData),
    })
    if (res.ok) {
      alert("Published! Changes are now live on the storefront.")
    } else {
      alert("Failed to publish. Check the server logs.")
    }
  }

  if (!data) {
    return <div style={{ padding: 24 }}>Loading editor…</div>
  }

  return (
    <div style={{ height: "100vh" }}>
      <Puck config={puckConfig} data={data} onPublish={publish} />
    </div>
  )
}
