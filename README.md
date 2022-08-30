# Cypress 10: Manage variables for multiple deployment environments in a system test

## Scenario:

Your app has multiple deployment environments. You completed a feature in `dev` and you want to promote a version to `staging`. Manual system testing hurts your soul. Instead, you want to write a suite of automated system tests that you can run, ad-hoc, against a version of your app.

## Env vars in Cypress 10:

Cypress [offers five](https://docs.cypress.io/guides/guides/environment-variables#Setting) ways to add environment variables to a spec. The documentation linked above is excellent; please read it to gain a full understanding of your options. For this scenario, we are interested in these three methods:

1. We can pass env vars in our `cypress run` command
1. We can define variables inside of our cypress config file: [`cypress.config.ts`](https://docs.cypress.io/guides/references/configuration)
1. We can define variables in a [`cypress.env.json`](https://docs.cypress.io/guides/guides/environment-variables#Option-2-cypress-env-json) file

## Let's begin

For the first test, you need to supply a specific id and get a specific response. Here is our application:

### PROBLEM!

Each deployment environment has its own database with its own data. _`dev` points to a dev database, `staging` to staging, and `prod` to prod_. **You will need to use a different set of variables in your system test for each environment.**

### Solution 1:

We can pass an arbitrary `cypress.config.ts` file as an option to our `cypress run` command. For example: `cypress run --e2e --config-file cypress/configs/dev-cypress.config.ts`

This means that we could keep three versions and define a different variable set for each:

#### `dev-cypress.config.ts`

```
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    env: {
      dev: {
        bookId: "dev-123",
        bookName: "The Waves",
      },
    },
  },
});

```

#### `stg-cypress.config.ts`

```
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    env: {
      staging: {
        bookId: "staging-456",
        bookName: "Trees 101 Indiana",
      },
    },
  },
});
```

#### `prod-cypress.config.ts`

```
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    env: {
      prod: {
        bookId: "prod-789",
        bookName: "Pragmatic Programmer",
      },
    },
  },
});

```

### Solution 2:

I don't like Solution 1 because it requires us to to change code in three files when we want to change data for a test.
It would be sweet if we could maintain a single file with data for all three environments. We can! We can gather everything into a **Giant Cross-Env JSON**.

#### `cypress.config.ts` aka Giant Cross-Env JSON

```
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

```

But how would we tell Cypress know which set of variables to use?
**We can pass in environment variables to the `cypress run` command.**
For example: `cypress run --env deployment-env=dev`

#### Next, we can change our Cypress spec

Instead of accessing the data directly like this:

```
cy.get('[data-cy="bookId"]').type(Cypress.env('bookId'));
```

We can use the env var that we set with `cypress run --env deployment-env=dev` as a key in our **Giant Cross-Env JSON**:

```
const activeEnv = Cypress.env("deployment-env");
cy.get('[data-cy="bookId"]').type(Cypress.env(activeEnv).bookId);
```

#### Too many variables?

If your **Giant Cross-Env JSON** becomes an **Unmanagably Large Cross-Env JSON**, consider storing the data in a [`cypress.env.json`](https://docs.cypress.io/guides/guides/environment-variables#Option-2-cypress-env-json) file.
_Nota Bene: Values in this json with the same keys as those in your `cypress.config.json` will **overwrite the vars in your `cypress.config.json`**_

## Example Repo:

Clone and (run this repo)[link to repo] to see an example and watch the tests run against a fake library app.
Checkout the `package.json` to run commands for both Solution 1 and 2.

## Further notes:

Neither of our solutions are sensible for running a System Test in a CI environment. If we are runnning a System Test, we will likely test workflows that require authentication. If we run a System Test locally, we can get away with storing sensitive data in a file excluded from our repo via .gitignore.
In a CI environment however, we should seek to retrieve sensitive data at runtime.

Note the extension of `cypress.config.ts`. **The configuration file is javascript!** This means we can leverage your favorite sensitive data storage solution in the begginning of your config.
We might take this a step further and even import our test json from a bucket held by your favorite cloud provider.

You might also keep a copy of your `cypress.config.ts` for each environment.

#### `config/dev-cypress.config.ts` might look like:

```
import { defineConfig } from "cypress";

// get non-sensitive data vars from bucket
const configVars = " your code to get vars from bucket";
// get secrets from arbitrary secret manager
const secrets = "your code to get vars from secret manager";

export default defineConfig({
  e2e: {
    env: {
      "secrets": secrets,
      "configVars": configVars,
    },
  },
});
```

**Cypress has excellent advice for [handling authentication testing](https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Logging-in).**
