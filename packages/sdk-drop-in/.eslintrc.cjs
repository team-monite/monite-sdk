module.exports = {
  extends: ["plugin:@team-monite/eslint-plugin/react"],
  plugins: ["@team-monite/eslint-plugin"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["./tsconfig.json", "./tsconfig.node.json"]
      }
    }
  },
  overrides: [
    {
      files: [".eslintrc.cjs"],
      env: {
        node: true
      },
      parserOptions: {
        project: null
      },
      rules: {
        "prettier/prettier": "off"
      }
    },
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
