import { Heart, MagnifyingGlass, ShoppingBag, User } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type OrientNavLink = { label?: string; href?: string }

export type OrientNavProps = {
  announcementText?: string
  logoText?: string
  links?: OrientNavLink[]
  backgroundColor?: string
  textColor?: string
}

/**
 * Presentational, Puck-editable navigation modeled on the Figma "Group 366" header:
 * a black announcement bar over a white nav with a centered wordmark, link groups
 * and the search / wishlist / account / cart icons.
 *
 * Note: the shared site chrome (`<Nav/>` in (main)/layout.tsx) still renders the
 * functional Medusa nav. This block is registered for page-builder use; place it
 * only on pages that don't already inherit the layout nav.
 */
const OrientNav = ({
  announcementText = "Free Shipping over Rs.22,400",
  logoText = "ORIENT",
  links = [
    { label: "New In", href: "/store" },
    { label: "Women", href: "/store" },
    { label: "Men", href: "/store" },
    { label: "Sale", href: "/store" },
  ],
  backgroundColor = "#ffffff",
  textColor = "#000000",
}: OrientNavProps) => {
  return (
    <header className="w-full">
      {/* Announcement bar */}
      {announcementText && (
        <div className="flex h-[50px] items-center justify-center bg-ink px-4 text-center text-label uppercase tracking-wide text-white">
          {announcementText}
        </div>
      )}

      {/* Main nav */}
      <nav
        className="flex h-[84px] items-center justify-between border-b border-line px-6 md:px-12"
        style={{ backgroundColor, color: textColor }}
      >
        {/* Left: primary links */}
        <ul className="hidden flex-1 items-center gap-x-6 text-label uppercase md:flex">
          {links.map((link, i) => (
            <li key={i}>
              <LocalizedClientLink
                href={link.href || "/store"}
                className="transition-opacity hover:opacity-60"
              >
                {link.label}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>

        {/* Center: wordmark */}
        <div className="flex flex-1 items-center justify-center md:flex-none">
          <LocalizedClientLink
            href="/"
            className="text-2xl font-semibold uppercase tracking-[0.2em]"
          >
            {logoText}
          </LocalizedClientLink>
        </div>

        {/* Right: utility icons */}
        <div className="flex flex-1 items-center justify-end gap-x-5">
          <button aria-label="Search" className="hover:opacity-60">
            <MagnifyingGlass />
          </button>
          <LocalizedClientLink href="/account" aria-label="Wishlist" className="hover:opacity-60">
            <Heart />
          </LocalizedClientLink>
          <LocalizedClientLink href="/account" aria-label="Account" className="hover:opacity-60">
            <User />
          </LocalizedClientLink>
          <LocalizedClientLink href="/cart" aria-label="Cart" className="hover:opacity-60">
            <ShoppingBag />
          </LocalizedClientLink>
        </div>
      </nav>
    </header>
  )
}

export default OrientNav
