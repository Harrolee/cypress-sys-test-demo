import { defineConfig } from "cypress";

// get vars from bucket
// get secrets from secret manager
// put in env

const configVars = "get from bucket";
const secrets = "get from secret manager";

export default defineConfig({
  e2e: {
    env: {
      "active-env": "dev",
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
