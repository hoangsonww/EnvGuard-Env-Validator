import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import { EnvGuardOptions, EnvSchema } from "../index.js";

export function validateEnv(options: EnvGuardOptions): void {
  const {
    schema,
    envFilePath = "./.env",
    exampleFilePath = "./.env.example",
    allowMissingExampleKeys = false,
    throwOnError = false
  } = options;

  console.log(`[EnvGuard] Loading env file: ${envFilePath}`);
  // Parse .env
  const envFileExists = fs.existsSync(envFilePath);
  if (!envFileExists) {
    const msg = `[EnvGuard] WARNING: .env file not found at "${envFilePath}"`;
    if (throwOnError) throw new Error(msg);
    console.warn(msg);
  } else {
    dotenv.config({ path: envFilePath });
  }

  // Parse .env.example
  console.log(`[EnvGuard] Checking .env.example at: ${exampleFilePath}`);
  let exampleKeys: string[] = [];
  if (fs.existsSync(exampleFilePath)) {
    const exampleContent = fs.readFileSync(exampleFilePath, "utf-8");
    // naive parse
    exampleKeys = parseEnvKeys(exampleContent);
  } else {
    console.warn(`[EnvGuard] WARNING: .env.example file not found at "${exampleFilePath}"`);
  }

  console.log("[EnvGuard] Validating environment variables...");
  const errors: string[] = [];

  // 1) Check for missing or insecure values as per the schema
  checkSchema(schema, errors, throwOnError);

  // 2) Compare .env.example keys to process.env (if .env.example exists)
  if (exampleKeys.length > 0) {
    compareExampleKeys(exampleKeys, allowMissingExampleKeys, errors, throwOnError);
  }

  if (errors.length > 0) {
    console.warn("[EnvGuard] Validation completed with warnings:");
    errors.forEach((err) => console.warn(" • " + err));
  } else {
    console.log("[EnvGuard] Validation passed with no issues!");
  }
}

/**
 * Compare .env.example keys to actual process.env keys
 */
function compareExampleKeys(
  exampleKeys: string[],
  allowMissingExampleKeys: boolean,
  errors: string[],
  throwOnError: boolean
) {
  for (const exKey of exampleKeys) {
    if (!process.env.hasOwnProperty(exKey)) {
      const msg = `[EnvGuard] Missing variable from .env: "${exKey}" is defined in .env.example`;
      if (throwOnError) {
        errors.push(msg);
      } else {
        console.warn(msg);
      }
    }
  }
  if (!allowMissingExampleKeys) {
    // If .env has keys that .env.example doesn't
    for (const envKey in process.env) {
      if (!exampleKeys.includes(envKey)) {
        const msg = `[EnvGuard] Extra variable "${envKey}" not found in .env.example. Might be inconsistent.`;
        if (throwOnError) {
          errors.push(msg);
        } else {
          console.warn(msg);
        }
      }
    }
  }
}

/**
 * Check schema: each var required? insecure values?
 */
function checkSchema(
  schema: EnvSchema,
  errors: string[],
  throwOnError: boolean
) {
  for (const envVar of Object.keys(schema)) {
    const isRequired = schema[envVar].required ?? false;
    const insecureValues = schema[envVar].insecureValues ?? [];
    const actualValue = process.env[envVar];

    if (isRequired && (actualValue === undefined || actualValue === "")) {
      const msg = `[EnvGuard] Required env var "${envVar}" is missing or empty!`;
      if (throwOnError) {
        errors.push(msg);
      } else {
        console.warn(msg);
      }
    }
    // check insecure
    if (actualValue !== undefined && insecureValues.includes(actualValue)) {
      const msg = `[EnvGuard] Env var "${envVar}" has an insecure value: "${actualValue}"`;
      if (throwOnError) {
        errors.push(msg);
      } else {
        console.warn(msg);
      }
    }
  }
}

/**
 * Rough parse for lines in .env.example or other text
 * that might represent KEY=VALUE
 */
function parseEnvKeys(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const keys: string[] = [];
  for (const line of lines) {
    // ignoring comments and empty
    if (!line.trim() || line.trim().startsWith("#")) {
      continue;
    }
    // e.g. KEY=VALUE
    const [key] = line.split("=");
    if (key) {
      keys.push(key.trim());
    }
  }
  return keys;
}
