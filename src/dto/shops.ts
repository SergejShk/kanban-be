import { z } from "zod";

export const newShopSchema = z
	.object({
		name: z.string(),
	})
	.strict();
