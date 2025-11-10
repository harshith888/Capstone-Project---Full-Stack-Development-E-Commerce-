declare module 'prisma/config' {
  // Minimal types to satisfy the TypeScript server for prisma.config.ts
  // Prisma's own CLI/runtime provides the actual implementation at runtime.
  export function defineConfig(config: any): any;
  export function env(key: string): string | undefined;
}
