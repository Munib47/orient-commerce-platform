import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { loadPuckData } from "@lib/puck/load"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import OrientNav from "@modules/layout/components/orient-nav"
import FooterSection from "@modules/home/components/footer-section"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  // Navigation + footer structure come from the CMS (Puck root props), so editor
  // changes reflect live across every storefront page.
  const data = await loadPuckData()
  const root = ((data as any)?.root?.props ?? {}) as {
    showNavigation?: boolean
    nav?: Record<string, any>
    footer?: Record<string, any>
  }
  const showNav = root.showNavigation !== false

  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()
    shippingOptions = shipping_options
  }

  return (
    <>
      {showNav && <OrientNav {...(root.nav ?? {})} />}

      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}

      {props.children}

      <FooterSection {...(root.footer ?? {})} />
    </>
  )
}
