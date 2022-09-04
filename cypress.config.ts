import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    env: {
      dev: {
        bookId: "dev-123",
        bookName: "The Waves",
      },
      staging: {
        bookId: "staging-456",
        bookName: "Trees 101 Indiana",
      },
      prod: {
        bookId: "prod-789",
        bookName: "Pragmatic Programmer",
      },
    },
  },
});
