import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      include: ['**/*.{ts,tsx}'],
      exclude: ['prisma.config.ts', 'prisma/**/*', 'app/**/'],
    },
  },
});
