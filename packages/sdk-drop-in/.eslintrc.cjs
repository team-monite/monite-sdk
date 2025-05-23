module.exports = {
  ignorePatterns: [".eslintrc.cjs", ".eslintrc.js", ".eslintrc.json"],
  overrides: [
    {
      files: ["*.js", "*.cjs"],
      parser: "espree",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "script"
      },
      env: {
        node: true
      },
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true }
        ]
      }
    },
    {
      files: ["vite.config.ts", "vite.config.dev.ts", "playwright.config.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      rules: {
        "import/no-default-export": "off",
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true }
        ]
      }
    },
    {
      files: ["src/**/*.ts", "src/**/*.tsx", "tests/**/*.ts", "tests/**/*.tsx"],
      extends: ["plugin:@team-monite/react"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname
      },
      settings: {
        "import/resolver": {
          typescript: {
            alwaysTryTypes: true,
            project: ["./tsconfig.json"]
          }
        }
      },
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true }
        ]
      }
    }
  ]
};
