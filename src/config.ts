import { config } from 'dotenv';
import { z } from 'zod';

config();
const envSchema = z.object({
  port: z.number().min(1).max(65535).optional(),
  github: z.object({
    token: z.string().min(20),
  }),
});

type Env = z.infer<typeof envSchema>;

const envObject: Env = {
  port: process.env.GITHUB_SERVICE_PORT ? Number(process.env.GITHUB_SERVICE_PORT) : 3000,
  github: {
    token: process.env.GITHUB_TOKEN ?? '',
  },
};

export const env = envSchema.parse(envObject);
