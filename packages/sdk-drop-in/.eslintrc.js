module.exports = {
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
  overrides: [
    {
      files: ["*"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true }
        ]
      }
    },
    {
      files: ["vite.config.ts", "vite.config.dev.ts"],
      rules: {
        "import/no-default-export": "off"
      }
    }
  ]
};
