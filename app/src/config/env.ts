import { z } from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().optional().default(3000),
    CORS_ORIGIN: z.union([z.string(), z.array(z.string())]).default("*"),
    JWT_SECRET: z.string(),
    MAILFLOW_URL: z.string(),
    FRONTEND_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
