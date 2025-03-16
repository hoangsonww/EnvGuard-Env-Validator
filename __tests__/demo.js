import { validateEnv } from "@hoangsonw/env-guard";

(async () => {
  // Example schema
  const schema = {
    DB_HOST: { required: true, insecureValues: ["localhost", "127.0.0.1"] },
    DB_PASSWORD: { required: true, insecureValues: ["12345", "password"] },
    DB_USER: { required: false }
  };

  validateEnv({
    schema,
    envFilePath: "./.env",             // default is .env
    exampleFilePath: "./.env.example", // default is .env.example
    allowMissingExampleKeys: false,
    throwOnError: false, // set to true to throw instead of warning
  });
})();
