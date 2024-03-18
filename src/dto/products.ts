import { z } from "zod";

export const newProductSchema = z
	.object({
		name: z.string(),
		price: z.string(),
		shopId: z.number(),
	})
	.strict();
