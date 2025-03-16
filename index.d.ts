/**
 * The shape of the environment variables schema:
 *  - You can define each env var as required or optional.
 *  - Possibly store default or insecure values to check for.
 */
export interface EnvSchema {
  [envVar: string]: {
    required?: boolean;
    insecureValues?: string[]; // e.g., ["default", "12345"]
  };
}

export interface EnvGuardOptions {
  schema: EnvSchema; // the schema to validate
  envFilePath?: string; // path to .env (default: "./.env")
  exampleFilePath?: string; // path to .env.example (default: "./.env.example")
  allowMissingExampleKeys?: boolean; // if false, warns if .env.example has keys missing in .env
  throwOnError?: boolean; // if true, throws an error on missing or insecure
}

export declare function validateEnv(options: EnvGuardOptions): void;
