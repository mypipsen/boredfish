import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    setupFiles: ['./src/server/tests/setup.ts'],
    coverage: {
      include: ['./src/server/**/*.{ts,tsx}'],
      exclude: ['prisma.config.ts', 'prisma/**/*', 'app/**/'],
    },
  },
});
