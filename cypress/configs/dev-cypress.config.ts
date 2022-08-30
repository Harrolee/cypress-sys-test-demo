/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { defineConfig } from "cypress";
// see link for options: https://docs.cypress.io/guides/references/configuration#Global

export default defineConfig({
  e2e: {
    // baseUrl: "https://dev-gateway.culligan.com/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    env: {
      "deployment-env": "dev",
    },
  },
});
