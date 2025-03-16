import { validateEnv } from "../dist/index.js";
import fs from "fs";
import path from "path";

// Mock .env and .env.example files
const ENV_PATH = path.resolve(__dirname, ".env");
const ENV_EXAMPLE_PATH = path.resolve(__dirname, ".env.example");

beforeAll(() => {
  // Create a mock .env file
  fs.writeFileSync(
    ENV_PATH,
    `DB_HOST=localhost\nDB_PASSWORD=12345\nDB_USER=admin\n`,
  );

  // Create a mock .env.example file
  fs.writeFileSync(ENV_EXAMPLE_PATH, `DB_HOST=\nDB_PASSWORD=\nDB_USER=\n`);
});

afterAll(() => {
  // Cleanup mock files
  fs.unlinkSync(ENV_PATH);
  fs.unlinkSync(ENV_EXAMPLE_PATH);
});

describe("EnvGuard - Environment Validation Tests", () => {
  it("should detect missing required environment variables", () => {
    const schema = {
      DB_HOST: { required: true },
      DB_PASSWORD: { required: true },
      API_KEY: { required: true }, // Missing in .env
    };

    const result = validateEnv({
      schema,
      envFilePath: ENV_PATH,
      exampleFilePath: ENV_EXAMPLE_PATH,
      allowMissingExampleKeys: false,
      throwOnError: false,
    });

    expect(result.errors).toContain(
      "Missing required environment variable: API_KEY",
    );
  });

  it("should detect insecure values in environment variables", () => {
    const schema = {
      DB_HOST: { required: true, insecureValues: ["localhost", "127.0.0.1"] },
      DB_PASSWORD: { required: true, insecureValues: ["12345", "password"] },
    };

    const result = validateEnv({
      schema,
      envFilePath: ENV_PATH,
      exampleFilePath: ENV_EXAMPLE_PATH,
      allowMissingExampleKeys: false,
      throwOnError: false,
    });

    expect(result.warnings).toContain(
      "Insecure value detected for DB_HOST: localhost",
    );
    expect(result.warnings).toContain(
      "Insecure value detected for DB_PASSWORD: 12345",
    );
  });

  it("should pass validation if all required variables are present and no insecure values exist", () => {
    const schema = {
      DB_HOST: { required: true, insecureValues: ["badhost"] },
      DB_PASSWORD: { required: true, insecureValues: ["badpass"] },
      DB_USER: { required: false },
    };

    const result = validateEnv({
      schema,
      envFilePath: ENV_PATH,
      exampleFilePath: ENV_EXAMPLE_PATH,
      allowMissingExampleKeys: false,
      throwOnError: false,
    });

    expect(result.errors.length).toBe(0);
    expect(result.warnings.length).toBe(0);
  });

  it("should detect missing keys in .env.example", () => {
    const schema = {
      DB_HOST: { required: true },
      DB_PASSWORD: { required: true },
      EXTRA_KEY: { required: true }, // Not listed in .env.example
    };

    const result = validateEnv({
      schema,
      envFilePath: ENV_PATH,
      exampleFilePath: ENV_EXAMPLE_PATH,
      allowMissingExampleKeys: false,
      throwOnError: false,
    });

    expect(result.warnings).toContain("Missing key in .env.example: EXTRA_KEY");
  });

  it("should not throw an error when throwOnError is false", () => {
    const schema = {
      DB_PASSWORD: { required: true, insecureValues: ["12345"] },
    };

    expect(() => {
      validateEnv({
        schema,
        envFilePath: ENV_PATH,
        exampleFilePath: ENV_EXAMPLE_PATH,
        allowMissingExampleKeys: false,
        throwOnError: false,
      });
    }).not.toThrow();
  });

  it("should throw an error when throwOnError is true and errors exist", () => {
    const schema = {
      API_KEY: { required: true }, // Missing in .env
    };

    expect(() => {
      validateEnv({
        schema,
        envFilePath: ENV_PATH,
        exampleFilePath: ENV_EXAMPLE_PATH,
        allowMissingExampleKeys: false,
        throwOnError: true,
      });
    }).toThrow("Missing required environment variable: API_KEY");
  });
});
