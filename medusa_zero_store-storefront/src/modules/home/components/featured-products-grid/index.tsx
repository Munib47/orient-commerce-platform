"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

export type CollectionRef = { id?: string; title?: string }

export type FeaturedProductsGridProps = {
  heading?: string
  collection?: CollectionRef
  productLimit?: number
  desktopColumns?: number
  mobileColumns?: number
  mobileSlider?: boolean
  backgroundColor?: string
  textColor?: string
}

const cols = (n?: number) => ({
  gridTemplateColumns: `repeat(${Math.max(1, n || 1)}, minmax(0, 1fr))`,
})

const ProductCard = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const { cheapestPrice } = getProductPrice({ product })
  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block">
      <div className="aspect-[3/4] w-full overflow-hidden bg-grey-10">
        {product.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-x-2 text-sm">
        <span className="truncate">{product.title}</span>
        {cheapestPrice && (
          <span className="whitespace-nowrap font-semibold">
            {cheapestPrice.calculated_price}
          </span>
        )}
      </div>
    </LocalizedClientLink>
  )
}

const FeaturedProductsGrid = ({
  heading = "",
  collection,
  productLimit = 4,
  desktopColumns = 4,
  mobileColumns = 2,
  mobileSlider = true,
  backgroundColor,
  textColor,
}: FeaturedProductsGridProps) => {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "gb"
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    ;(async () => {
      try {
        const { regions } = await sdk.client.fetch<{
          regions: HttpTypes.StoreRegion[]
        }>("/store/regions", { method: "GET" })

        const region =
          regions.find((r) =>
            r.countries?.some((c) => c.iso_2 === countryCode)
          ) || regions[0]

        if (!region) {
          if (active) setProducts([])
          return
        }

        const query: Record<string, string | number> = {
          limit: productLimit,
          region_id: region.id,
          fields: "*variants.calculated_price",
        }
        if (collection?.id) query.collection_id = collection.id

        const { products: fetched } = await sdk.client.fetch<{
          products: HttpTypes.StoreProduct[]
        }>("/store/products", { method: "GET", query })

        if (active) setProducts(fetched || [])
      } catch {
        if (active) setProducts([])
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [collection?.id, productLimit, countryCode])

  return (
    <section
      className="content-container w-full py-12 small:py-16"
      style={{ backgroundColor, color: textColor }}
    >
      {heading && <h2 className="mb-8 text-2xl font-semibold md:text-3xl">{heading}</h2>}

      {loading ? (
        <p className="text-muted">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        <>
          {/* Desktop grid */}
          <div className="hidden gap-x-6 gap-y-10 md:grid" style={cols(desktopColumns)}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Mobile: slider or grid */}
          <div className="md:hidden">
            {mobileSlider ? (
              <Swiper
                spaceBetween={16}
                slidesPerView={Math.max(1, mobileColumns)}
                className="w-full"
              >
                {products.map((p) => (
                  <SwiperSlide key={p.id}>
                    <ProductCard product={p} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="grid gap-x-4 gap-y-8" style={cols(mobileColumns)}>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default FeaturedProductsGrid
