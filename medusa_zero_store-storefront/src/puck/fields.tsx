import type { Field } from "@measured/puck"
import React from "react"

type CustomRenderProps = { value: any; onChange: (value: any) => void }

/**
 * Reusable custom Puck fields. `custom` field renders are editor-only (never run
 * on the live <Render> page), so DOM inputs here are safe.
 */

export const colorField = (label: string): Field => ({
  type: "custom",
  label,
  render: ({ value, onChange }: CustomRenderProps) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="color"
        value={value || "#ffffff"}
        onChange={(e) => onChange(e.currentTarget.value)}
        style={{ width: 40, height: 32, padding: 0, border: "none", background: "none" }}
      />
      <input
        type="text"
        value={value || ""}
        placeholder="#ffffff"
        onChange={(e) => onChange(e.currentTarget.value)}
        style={{ flex: 1, padding: "6px 8px", border: "1px solid #ddd", borderRadius: 4 }}
      />
    </div>
  ),
})

export const toggleField = (label: string): Field => ({
  type: "custom",
  label,
  render: ({ value, onChange }: CustomRenderProps) => (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <span>{label}</span>
    </label>
  ),
})
