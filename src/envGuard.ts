import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import { EnvGuardOptions, EnvSchema } from "./index.js";

/**
 * Attempt to auto-detect the caller script's directory from stack trace,
 * removing any "file://" prefix.
 *
 * @returns The directory of the caller script.
 */
function getCallerDirFallback(): string {
  try {
    // Get the stack trace to find the caller's directory
    const origPrepare = Error.prepareStackTrace;
    Error.prepareStackTrace = (err, stack) => stack;
    const err = new Error();
    const stack = err.stack as unknown as NodeJS.CallSite[];
    Error.prepareStackTrace = origPrepare;

    // stack[0] is getCallerDirFallback
    // stack[1] is validateEnv
    // stack[2] is the calling script
    const callerFrame = stack[2] || stack[1];
    let callerFile = callerFrame.getFileName();

    // If there's a "file://" prefix, remove it
    if (callerFile && callerFile.startsWith("file://")) {
      callerFile = callerFile.replace("file://", "");
    }

    // Return the directory of the caller file
    if (callerFile) {
      return path.dirname(callerFile);
    }
  } catch (ex) {
    // fallback - return current working directory
  }

  return process.cwd();
}

/**
 * Validate environment variables against a schema and .env.example file.
 *
 * @param options - The options for validation.
 */
export function validateEnv(options: EnvGuardOptions): void {
  // Destructure options
  const {
    schema,
    envFilePath = "./.env",
    exampleFilePath = "./.env.example",
    allowMissingExampleKeys = false,
    throwOnError = false,
    baseDir,
  } = options;

  // If user didn't supply baseDir, attempt to find caller's directory
  const finalBaseDir = baseDir || getCallerDirFallback();

  // Convert relative paths to absolute paths from finalBaseDir
  const absoluteEnvPath = path.resolve(finalBaseDir, envFilePath);
  const absoluteExamplePath = path.resolve(finalBaseDir, exampleFilePath);

  // Load .env file
  console.log(`[EnvGuard] Loading env file: ${absoluteEnvPath}`);
  if (!fs.existsSync(absoluteEnvPath)) {
    const msg = `[EnvGuard] WARNING: .env file not found at "${absoluteEnvPath}"`;

    // If throwOnError is true, throw an error
    if (throwOnError) {
      throw new Error(msg);
    }

    console.warn(msg);
  } else {
    dotenv.config({ path: absoluteEnvPath });
  }

  // Load .env.example file
  console.log(`[EnvGuard] Checking .env.example at: ${absoluteExamplePath}`);
  let exampleKeys: string[] = [];

  if (fs.existsSync(absoluteExamplePath)) {
    const exampleContent = fs.readFileSync(absoluteExamplePath, "utf-8");
    exampleKeys = parseEnvKeys(exampleContent);
  } else {
    const msg = `[EnvGuard] WARNING: .env.example file not found at "${absoluteExamplePath}"`;
    if (throwOnError) throw new Error(msg);
    console.warn(msg);
  }

  // Validate schema
  console.log("[EnvGuard] Validating environment variables...");
  const errors: string[] = [];
  checkSchema(schema, errors, throwOnError);

  // Compare .env and .env.example keys
  if (exampleKeys.length > 0) {
    compareExampleKeys(
      exampleKeys,
      allowMissingExampleKeys,
      errors,
      throwOnError,
    );
  }

  // Log results
  if (errors.length > 0) {
    console.warn("[EnvGuard] Validation completed with warnings:");
    errors.forEach((err) => console.warn(" • " + err));
  } else {
    console.log("[EnvGuard] Validation passed with no issues!");
  }
}

/**
 * Compare the keys in the .env file with the keys in the .env.example file.
 * If any keys are missing or extra, log a warning.
 *
 * @param exampleKeys - The keys from the .env.example file.
 * @param allowMissingExampleKeys - Whether to allow missing keys in the .env file.
 * @param errors - The array to store error messages.
 * @param throwOnError - Whether to throw an error if there are issues.
 */
function compareExampleKeys(
  exampleKeys: string[],
  allowMissingExampleKeys: boolean,
  errors: string[],
  throwOnError: boolean,
) {
  // Check for missing keys
  for (const exKey of exampleKeys) {
    if (!Object.prototype.hasOwnProperty.call(process.env, exKey)) {
      const msg = `[EnvGuard] Missing variable from .env: "${exKey}" is in .env.example`;

      if (throwOnError) {
        errors.push(msg);
      } else console.warn(msg);
    }
  }

  // Check for extra keys
  if (!allowMissingExampleKeys) {
    for (const envKey in process.env) {
      if (!exampleKeys.includes(envKey)) {
        const msg = `[EnvGuard] Extra variable "${envKey}" not in .env.example. Might be inconsistent.`;

        if (throwOnError) {
          errors.push(msg);
        } else console.warn(msg);
      }
    }
  }
}

/**
 * Check the schema for required and insecure values.
 *
 * @param schema - The schema to check.
 * @param errors - The array to store error messages.
 * @param throwOnError - Whether to throw an error if there are issues.
 */
function checkSchema(
  schema: EnvSchema,
  errors: string[],
  throwOnError: boolean,
) {
  // Check for required and insecure values
  for (const envVar of Object.keys(schema)) {
    // Get the actual value from process.env
    const { required = false, insecureValues = [] } = schema[envVar];
    const actualValue = process.env[envVar];

    // Check for required variable
    if (required && (!actualValue || actualValue.trim() === "")) {
      const msg = `[EnvGuard] Required env var "${envVar}" is missing or empty!`;
      if (throwOnError) errors.push(msg);
      else console.warn(msg);
    }

    // Check for insecure values
    if (actualValue !== undefined && insecureValues.includes(actualValue)) {
      const msg = `[EnvGuard] Env var "${envVar}" has an insecure value: "${actualValue}"`;
      if (throwOnError) errors.push(msg);
      else console.warn(msg);
    }
  }
}

/**
 * Parse the keys from the .env file content.
 *
 * @param content
 */
function parseEnvKeys(content: string): string[] {
  // Split content into lines
  const lines = content.split(/\r?\n/);
  const keys: string[] = [];

  // Parse each line
  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const [key] = trimmed.split("=");

    if (key) {
      keys.push(key.trim());
    }
  }
  return keys;
}
