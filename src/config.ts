import { config } from 'dotenv';
import { z } from 'zod';

config();
const envSchema = z.object({
  github: z.object({
    token: z.string().min(20),
  }),
});

type Env = z.infer<typeof envSchema>;

const envObject: Env = {
  github: {
    token: process.env.GITHUB_TOKEN ?? '',
  },
};

export const env = envSchema.parse(envObject);
