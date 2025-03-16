/**
 * EnvGuard options and schema types.
 */
export interface EnvSchema {
  [envVar: string]: {
    required?: boolean;
    insecureValues?: string[];
  };
}

/**
 * Options for the EnvGuard.
 */
export interface EnvGuardOptions {
  schema: EnvSchema; // required, e.g. { DB_HOST: { required: true } }
  envFilePath?: string; // default: "./.env"
  exampleFilePath?: string; // default: "./.env.example"
  allowMissingExampleKeys?: boolean; // default: false
  throwOnError?: boolean; // default: false

  /**
   * If provided, this path is used as the 'base directory' for .env files.
   * If omitted, we attempt to auto-detect the caller's directory via stack trace.
   */
  baseDir?: string;
}
