import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type FooterLink = { label?: string; href?: string }
export type FooterColumn = { title?: string; links?: FooterLink[] }

export type FooterSectionProps = {
  logoText?: string
  columns?: FooterColumn[]
  copyright?: string
  backgroundColor?: string
  textColor?: string
}

/**
 * CMS-driven footer. Replaces the hardcoded starter footer; logo, link columns,
 * copyright and colors are all editable from Puck.
 */
const FooterSection = ({
  logoText = "ORIENT",
  columns = [],
  copyright = `© ${new Date().getFullYear()} Orient. All rights reserved.`,
  backgroundColor = "#000000",
  textColor = "#ffffff",
}: FooterSectionProps) => {
  return (
    <footer className="w-full" style={{ backgroundColor, color: textColor }}>
      <div className="content-container flex w-full flex-col gap-y-10 py-16">
        <div className="flex flex-col gap-y-10 md:flex-row md:justify-between">
          <LocalizedClientLink
            href="/"
            className="text-2xl font-semibold uppercase tracking-[0.2em]"
          >
            {logoText}
          </LocalizedClientLink>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-x-16">
            {columns.map((col, i) => (
              <div key={i} className="flex flex-col gap-y-3">
                <span className="text-sm font-semibold uppercase tracking-wide opacity-90">
                  {col.title}
                </span>
                <ul className="flex flex-col gap-y-2">
                  {(col.links || []).map((link, j) => (
                    <li key={j}>
                      <LocalizedClientLink
                        href={link.href || "/"}
                        className="text-sm opacity-70 transition-opacity hover:opacity-100"
                      >
                        {link.label}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/15 pt-6 text-sm opacity-70">
          {copyright}
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
