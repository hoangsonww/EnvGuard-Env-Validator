# 🛡️ EnvGuard – Validate & Secure Your Environment Variables

[![NPM version](https://img.shields.io/npm/v/env-guard.svg?style=flat&logo=npm)](https://www.npmjs.com/package/env-guard) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat&logo=opensource)](LICENSE) [![Node.js](https://img.shields.io/badge/Node-%3E%3D14-brightgreen.svg?style=flat&logo=node.js)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/) [![Jest](https://img.shields.io/badge/Jest-27.0%2B-cyan.svg?style=flat&logo=jest)](https://jestjs.io/)

**EnvGuard** is an NPM package that validates your environment variables against a defined schema and enforces consistency with your `.env.example` file. Protect your application from misconfigurations and insecure defaults when working in teams or deploying to production.

Currently available on NPM: [https://www.npmjs.com/package/@hoangsonw/env-guard](https://www.npmjs.com/package/@hoangsonw/env-guard)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Advanced Usage](#advanced-usage)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Building & Publishing](#building--publishing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Schema Validation:** Define required environment variables and insecure default values.
- **.env Enforcement:** Compare your actual `.env` file against a provided `.env.example` file.
- **Configurable Behavior:** Choose whether to warn or throw errors, and control key matching.
- **TypeScript Support:** Fully written in TypeScript with complete type definitions.
- **Cross-Platform:** Works in Node.js and integrates seamlessly into your deployment workflows.

---

## Installation

### Prerequisites

- Node.js v14 or higher
- npm v6 or higher

### Installing via NPM

```bash
npm install @hoangsonw/env-guard
```

### Installing via Yarn

```bash
yarn add @hoangsonw/env-guard
```

---

## Usage

EnvGuard validates your environment variables based on a schema. It loads variables from your `.env` file and compares them against a reference `.env.example`.

### Basic Usage

Create a schema for your environment variables and validate:

```ts
import { validateEnv } from "@hoangsonw/env-guard";

const schema = {
  DB_HOST: { required: true, insecureValues: ["localhost", "127.0.0.1"] },
  DB_PASSWORD: { required: true, insecureValues: ["12345", "password"] },
  DB_USER: { required: false },
};

validateEnv({
  schema,
  envFilePath: "./.env", // Defaults to "./.env"
  exampleFilePath: "./.env.example", // Defaults to "./.env.example"
  allowMissingExampleKeys: false, // Warn if keys mismatch
  throwOnError: false, // Only warn; set to true to throw errors
});
```

### Advanced Usage

You can customize EnvGuard’s behavior by changing options:

- **`allowMissingExampleKeys`**: When `false`, it warns if there are extra keys in your `.env` or missing keys compared to `.env.example`.
- **`throwOnError`**: When `true`, the function will throw errors instead of just logging warnings.

Example:

```ts
import { validateEnv } from "@hoangsonw/env-guard";

const schema = {
  API_KEY: { required: true },
  DB_HOST: { required: true, insecureValues: ["localhost"] },
  DB_PASSWORD: { required: true, insecureValues: ["password", "12345"] },
};

try {
  validateEnv({
    schema,
    envFilePath: "./config/.env",
    exampleFilePath: "./config/.env.example",
    allowMissingExampleKeys: false,
    throwOnError: true,
  });
  console.log("Environment variables validation passed!");
} catch (error) {
  console.error("Environment validation failed:", error);
  process.exit(1);
}
```

---

## API Reference

### `validateEnv(options: EnvGuardOptions): void`

**Parameters:**

- **`schema: EnvSchema`**  
  An object defining each environment variable’s requirements.  
  _Example:_

  ```ts
  {
    DB_HOST: { required: true, insecureValues: ["localhost"] },
    API_KEY: { required: true }
  }
  ```

- **`envFilePath?: string`**  
  Path to your `.env` file. Defaults to `"./.env"`.

- **`exampleFilePath?: string`**  
  Path to your `.env.example` file. Defaults to `"./.env.example"`.

- **`allowMissingExampleKeys?: boolean`**  
  If set to `false`, EnvGuard will warn about extra keys or missing keys between `.env` and `.env.example`.

- **`throwOnError?: boolean`**  
  If `true`, the function will throw an error when validations fail; otherwise, it will only log warnings.

**Returns:**  
Nothing; it performs validation and logs warnings/errors as configured.

---

## Testing

EnvGuard includes a Jest test suite. To run tests:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run tests:**
   ```bash
   npm test
   ```

Test files in the `__tests__` directory demonstrate how EnvGuard validates environment variables and compares `.env` to `.env.example`.

---

## Demo Scripts

Run the demo scripts in the `__tests__` directory to see EnvGuard in action:

1. **Run the demo script (with no `basedir` option):**
   ```bash
   npm run demoNoBasedir
   ```
2. **Run the demo script (with `basedir` option):**
   ```bash
    npm run demoWithBasedir
   ```

The demo scripts will show how EnvGuard validates environment variables and compares `.env` to `.env.example`. Check the console output for validation results.

---

## Building & Publishing

### Building

Compile the TypeScript source:

```bash
npm run build
```

### Publishing

1. **Login to npm:**
   ```bash
   npm login
   ```
2. **Publish the package:**
   ```bash
   npm publish --access public
   ```

---

## Contributing

Contributions are welcome! Follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Commit Your Changes**
4. **Submit a Pull Request**

For major changes, please open an issue first to discuss your ideas.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Final Remarks

EnvGuard ensures your environment variables are correctly configured and secure, reducing misconfigurations in team settings and production deployments. With schema validation and `.env.example` enforcement, it helps maintain consistency and security in your projects.

Happy guarding! 🛡️
