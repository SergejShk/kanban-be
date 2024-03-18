import { z } from "zod";

export const newOrderSchema = z
	.object({
		customerName: z.string(),
		email: z.string().email().min(5),
		phone: z.string().min(5).max(20),
		address: z.string(),
		products: z
			.object({
				id: z.number(),
				name: z.string(),
				price: z.string(),
				shopId: z.number(),
				count: z.number(),
				createdAt: z.coerce.date(),
			})
			.strict()
			.array(),
	})
	.strict();
