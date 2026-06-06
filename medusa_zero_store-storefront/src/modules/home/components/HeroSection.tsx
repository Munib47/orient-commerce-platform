"use client"

import Link from "next/link"
import { Button, clx } from "@medusajs/ui"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

export type HeroSlide = {
  desktopImage?: string
  mobileImage?: string
  imageAlt?: string
  heading?: string
  subheading?: string
  ctaLabel?: string
  ctaHref?: string
}

export type HeroSectionProps = {
  slides?: HeroSlide[]
  autoplay?: boolean
  align?: "left" | "center"
  backgroundColor?: string
  textColor?: string
}

/**
 * Multi-slide hero modeled on the Figma "home page 1440" hero. Each slide supports
 * separate desktop/mobile artwork plus optional overlay copy and a CTA. Renders a
 * Swiper carousel when there is more than one slide. CMS image URLs can be any host,
 * so a plain <img> is used (no next/image remotePatterns config needed).
 */
const Slide = ({
  slide,
  align,
  textColor,
}: {
  slide: HeroSlide
  align: "left" | "center"
  textColor?: string
}) => {
  const desktop = slide.desktopImage || slide.mobileImage || "/figma/home-hero.png"
  const mobile = slide.mobileImage || desktop

  return (
    <div className="relative aspect-[1440/554] min-h-[420px] w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={desktop}
        alt={slide.imageAlt || "Orient"}
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mobile}
        alt={slide.imageAlt || "Orient"}
        className="absolute inset-0 block h-full w-full object-cover md:hidden"
      />

      <div
        className={clx(
          "absolute inset-0 flex flex-col justify-end gap-y-5 p-8 pb-16 md:p-16",
          align === "center" ? "items-center text-center" : "items-start text-left"
        )}
        style={{ color: textColor }}
      >
        {slide.heading && (
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight drop-shadow-sm md:text-[2.6875rem] md:leading-[3.3125rem]">
            {slide.heading}
          </h1>
        )}
        {slide.subheading && (
          <p className="max-w-xl text-base font-light opacity-90 md:text-lg">
            {slide.subheading}
          </p>
        )}
        {slide.ctaLabel && (
          <Link href={slide.ctaHref || "/store"} aria-label={slide.ctaLabel}>
            <Button
              variant="secondary"
              className="h-16 rounded-none border-0 bg-white px-12 text-2xl font-semibold text-ink hover:bg-white/90"
            >
              {slide.ctaLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

const HeroSection = ({
  slides,
  autoplay = true,
  align = "center",
  backgroundColor,
  textColor = "#ffffff",
}: HeroSectionProps) => {
  const items =
    slides && slides.length > 0
      ? slides
      : [{ desktopImage: "/figma/home-hero.png", ctaLabel: "shop now", ctaHref: "/store" }]

  return (
    <section
      className="relative w-full overflow-hidden bg-ink"
      style={{ backgroundColor }}
    >
      {items.length === 1 ? (
        <Slide slide={items[0]} align={align} textColor={textColor} />
      ) : (
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
          loop
          className="w-full"
        >
          {items.map((slide, i) => (
            <SwiperSlide key={i}>
              <Slide slide={slide} align={align} textColor={textColor} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}

export default HeroSection
