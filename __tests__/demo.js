import { validateEnv } from "@hoangsonw/env-guard";

(async () => {
  // Example schema
  const schema = {
    DB_HOST: { required: true, insecureValues: ["localhost", "127.0.0.1"] },
    DB_PASSWORD: { required: true, insecureValues: ["12345", "password"] },
    DB_USER: { required: false },
  };

  validateEnv({
    schema,
    envFilePath: "./.env", // default is .env
    exampleFilePath: "./.env.example", // default is .env.example
    allowMissingExampleKeys: false,
    throwOnError: false, // set to true to throw instead of warning
  });
})();

// Should output something like:
// > node __tests__/demo.js
//
// [EnvGuard] Loading env file: ./.env
// [EnvGuard] WARNING: .env file not found at "./.env"
// [EnvGuard] Checking .env.example at: ./.env.example
// [EnvGuard] WARNING: .env.example file not found at "./.env.example"
// [EnvGuard] Validating environment variables...
// [EnvGuard] Required env var "DB_HOST" is missing or empty!
// [EnvGuard] Required env var "DB_PASSWORD" is missing or empty!
// [EnvGuard] Validation passed with no issues!
