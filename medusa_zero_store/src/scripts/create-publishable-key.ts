import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function createPublishableKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });

  if (!salesChannels.length) {
    throw new Error("No sales channel found to link the publishable key to.");
  }

  // Idempotent: reuse an existing publishable key if one already exists.
  const { data: existingKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "type", "title"],
    filters: { type: "publishable" },
  });

  let apiKeyId: string;
  let token: string;

  if (existingKeys.length) {
    apiKeyId = existingKeys[0].id;
    token = existingKeys[0].token;
    logger.info(`Reusing existing publishable key "${existingKeys[0].title}".`);
  } else {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Storefront", type: "publishable", created_by: "" }],
      },
    });
    apiKeyId = result[0].id;
    token = result[0].token;
    logger.info(`Created publishable key "Storefront".`);
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: apiKeyId, add: salesChannels.map((sc) => sc.id) },
  });

  logger.info(`Linked ${salesChannels.length} sales channel(s) to the key.`);
  logger.info(`PUBLISHABLE_KEY_TOKEN=${token}`);
}
