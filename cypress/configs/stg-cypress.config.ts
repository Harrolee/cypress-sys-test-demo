/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { defineConfig } from "cypress";
// see link for options: https://docs.cypress.io/guides/references/configuration#Global

export default defineConfig({
  e2e: {
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    env: {
      "deployment-env": "staging",
    },
  },
});
