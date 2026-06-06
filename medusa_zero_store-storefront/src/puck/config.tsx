// src/puck/config.tsx
import type { Config, Field } from "@measured/puck"
import React from "react"
import { sdk } from "@lib/config"
import { colorField, toggleField } from "./fields"

import HeroSection from "@modules/home/components/HeroSection"
import FeaturedProductsGrid from "@modules/home/components/featured-products-grid"
import OrientNav from "@modules/layout/components/orient-nav"
import FooterSection from "@modules/home/components/footer-section"

/* ------------------------------------------------------------------ */
/* Reusable field groups (shared between blocks and global root props) */
/* ------------------------------------------------------------------ */

const navFields: Record<string, Field> = {
  announcementText: { type: "text", label: "Announcement text" },
  logoText: { type: "text", label: "Logo text" },
  links: {
    type: "array",
    label: "Links",
    arrayFields: {
      label: { type: "text" },
      href: { type: "text" },
    },
    getItemSummary: (item: any) => item?.label || "Link",
  },
  backgroundColor: colorField("Background color"),
  textColor: colorField("Text color"),
}

const footerFields: Record<string, Field> = {
  logoText: { type: "text", label: "Logo text" },
  columns: {
    type: "array",
    label: "Link columns",
    arrayFields: {
      title: { type: "text" },
      links: {
        type: "array",
        arrayFields: {
          label: { type: "text" },
          href: { type: "text" },
        },
        getItemSummary: (item: any) => item?.label || "Link",
      },
    },
    getItemSummary: (item: any) => item?.title || "Column",
  },
  copyright: { type: "text", label: "Copyright text" },
  backgroundColor: colorField("Background color"),
  textColor: colorField("Text color"),
}

const heroFields: Record<string, Field> = {
  slides: {
    type: "array",
    label: "Slides",
    arrayFields: {
      desktopImage: { type: "text", label: "Desktop image URL" },
      mobileImage: { type: "text", label: "Mobile image URL" },
      imageAlt: { type: "text", label: "Image alt" },
      heading: { type: "text" },
      subheading: { type: "textarea" },
      ctaLabel: { type: "text", label: "CTA label" },
      ctaHref: { type: "text", label: "CTA link" },
    },
    getItemSummary: (item: any) => item?.heading || item?.ctaLabel || "Slide",
  },
  align: {
    type: "radio",
    options: [
      { label: "Center", value: "center" },
      { label: "Left", value: "left" },
    ],
  },
  autoplay: toggleField("Enable auto-play for slider"),
  backgroundColor: colorField("Background color"),
  textColor: colorField("Text color"),
}

const featuredFields: Record<string, Field> = {
  heading: { type: "text" },
  collection: {
    type: "external",
    placeholder: "All products (or pick a collection)",
    fetchList: async () => {
      const { collections } = await sdk.client.fetch<{
        collections: { id: string; title: string }[]
      }>("/store/collections", { query: { limit: 100 } })
      return collections.map((c) => ({ id: c.id, title: c.title }))
    },
    getItemSummary: (item: any) => item?.title || "All products",
  },
  productLimit: { type: "number", label: "Product limit", min: 1, max: 24 },
  desktopColumns: { type: "number", label: "Desktop columns", min: 1, max: 6 },
  mobileColumns: { type: "number", label: "Mobile columns", min: 1, max: 3 },
  mobileSlider: toggleField("Use slider on mobile"),
  backgroundColor: colorField("Background color"),
  textColor: colorField("Text color"),
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

const navDefaults = {
  announcementText: "Free Shipping over Rs.22,400",
  logoText: "ORIENT",
  links: [
    { label: "New In", href: "/store" },
    { label: "Women", href: "/store" },
    { label: "Men", href: "/store" },
    { label: "Sale", href: "/store" },
  ],
  backgroundColor: "#ffffff",
  textColor: "#000000",
}

const footerDefaults = {
  logoText: "ORIENT",
  columns: [
    {
      title: "Shop",
      links: [
        { label: "New In", href: "/store" },
        { label: "Women", href: "/store" },
        { label: "Men", href: "/store" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Shipping", href: "/" },
        { label: "Returns", href: "/" },
        { label: "Contact", href: "/" },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} Orient. All rights reserved.`,
  backgroundColor: "#000000",
  textColor: "#ffffff",
}

const SpacerBlock = ({ height }: { height?: number }) => (
  <div style={{ height: height ?? 40 }} />
)

/* ------------------------------------------------------------------ */
/* Config                                                             */
/* ------------------------------------------------------------------ */

export const puckConfig: Config = {
  root: {
    fields: {
      showNavigation: toggleField("Show navigation"),
      nav: { type: "object", label: "Navigation settings", objectFields: navFields } as Field,
      footer: { type: "object", label: "Footer settings", objectFields: footerFields } as Field,
    },
    defaultProps: {
      showNavigation: true,
      nav: navDefaults,
      footer: footerDefaults,
    } as any,
    render: ({ children }: any) => <>{children}</>,
  },
  components: {
    Navigation: {
      label: "Navigation (Orient)",
      fields: navFields,
      defaultProps: navDefaults,
      render: ({ puck, editMode, ...props }: any) => <OrientNav {...props} />,
    },
    Hero: {
      label: "Hero (Orient)",
      fields: heroFields,
      defaultProps: {
        slides: [
          {
            desktopImage: "/figma/home-hero.png",
            imageAlt: "Orient",
            ctaLabel: "shop now",
            ctaHref: "/store",
          },
        ],
        align: "center",
        autoplay: true,
        textColor: "#ffffff",
      },
      render: ({ puck, editMode, ...props }: any) => <HeroSection {...props} />,
    },
    FeaturedProductsGrid: {
      label: "Featured Products Grid",
      fields: featuredFields,
      defaultProps: {
        heading: "",
        productLimit: 4,
        desktopColumns: 4,
        mobileColumns: 2,
        mobileSlider: true,
      },
      render: ({ puck, editMode, ...props }: any) => (
        <FeaturedProductsGrid {...props} />
      ),
    },
    FooterSection: {
      label: "Footer (Orient)",
      fields: footerFields,
      defaultProps: footerDefaults,
      render: ({ puck, editMode, ...props }: any) => <FooterSection {...props} />,
    },
    Spacer: {
      fields: { height: { type: "number" } },
      render: ({ puck, editMode, ...props }: any) => <SpacerBlock {...props} />,
    },
  },
}
