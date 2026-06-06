import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  createCollectionsWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function createFeaturedCollection({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModule = container.resolve(Modules.PRODUCT);

  // Idempotent: reuse a "Featured" collection if it already exists.
  const existing = await productModule.listProductCollections({
    title: "Featured",
  });

  let collectionId: string;
  if (existing.length) {
    collectionId = existing[0].id;
    logger.info(`Reusing existing "Featured" collection (${collectionId}).`);
  } else {
    const { result } = await createCollectionsWorkflow(container).run({
      input: { collections: [{ title: "Featured" }] },
    });
    collectionId = result[0].id;
    logger.info(`Created "Featured" collection (${collectionId}).`);
  }

  const products = await productModule.listProducts({}, { select: ["id"] });
  if (!products.length) {
    logger.warn("No products found to assign. Run `npm run seed` first.");
    return;
  }

  await updateProductsWorkflow(container).run({
    input: {
      selector: { id: products.map((p) => p.id) },
      update: { collection_id: collectionId },
    },
  });

  logger.info(`Assigned ${products.length} product(s) to "Featured".`);
}
