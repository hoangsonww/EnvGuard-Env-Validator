import { fileURLToPath } from "url";
import path from "path";
import { validateEnv } from "@hoangsonw/env-guard";

// Compute __dirname in an ESM module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log("\n--- [DEMO: WITH BASEDIR] ---\n");

  const schema = {
    DB_HOST: { required: true, insecureValues: ["localhost", "127.0.0.1"] },
    DB_PASSWORD: { required: true, insecureValues: ["12345", "password"] },
    DB_USER: { required: false },
  };

  // Use the computed __dirname as the base directory
  const baseDir = __dirname;
  validateEnv({
    schema,
    envFilePath: "./.env",
    exampleFilePath: "./.env.example",
    allowMissingExampleKeys: false,
    throwOnError: false,
    baseDir,
  });

  console.log("\n--- [END DEMO: WITH BASEDIR] ---\n");
})();

// Should output something like:
// > node __tests__/demo_with_basedir.js
//
//
// --- [DEMO: WITH BASEDIR] ---
//
// [EnvGuard] Loading env file: /Users/davidnguyen/WebstormProjects/EnvGuard-Env-Validator/__tests__/.env
// [EnvGuard] Checking .env.example at: /Users/davidnguyen/WebstormProjects/EnvGuard-Env-Validator/__tests__/.env.example
// [EnvGuard] Validating environment variables...
// [EnvGuard] Env var "DB_HOST" has an insecure value: "localhost"
// [EnvGuard] Env var "DB_PASSWORD" has an insecure value: "12345"
// [EnvGuard] Extra variable "NVM_INC" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "NODE" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "INIT_CWD" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "NVM_CD_FLAGS" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "ANDROID_HOME" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "SHELL" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "TERM" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "TMPDIR" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "HOMEBREW_REPOSITORY" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_global_prefix" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "COLOR" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_noproxy" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_local_prefix" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "USER" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "NVM_DIR" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "COMMAND_MODE" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_globalconfig" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "SSH_AUTH_SOCK" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "__CF_USER_TEXT_ENCODING" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_execpath" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "PATH" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_package_json" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_userconfig" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_init_module" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "__CFBundleIdentifier" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_command" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "PWD" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "JAVA_HOME" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_lifecycle_event" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "EDITOR" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_package_name" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_npm_version" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "XPC_FLAGS" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_node_gyp" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_package_version" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "XPC_SERVICE_NAME" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "SHLVL" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "HOME" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_strict_ssl" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_loglevel" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "HOMEBREW_PREFIX" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_cache" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "LOGNAME" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_lifecycle_script" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "LC_CTYPE" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "NVM_BIN" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_user_agent" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "HOMEBREW_CELLAR" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "INFOPATH" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "PYTHON" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_node_execpath" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "npm_config_prefix" not in .env.example. Might be inconsistent.
// [EnvGuard] Extra variable "_" not in .env.example. Might be inconsistent.
// [EnvGuard] Validation passed with no issues!
//
// --- [END DEMO: WITH BASEDIR] ---
