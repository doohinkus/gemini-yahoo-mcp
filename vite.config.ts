import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node18",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "@modelcontextprotocol/sdk",
        "imap-simple",
        "nodemailer",
        "dotenv",
        "node:*",
      ],
    },
    outDir: "dist",
    ssr: true,
  },
});
