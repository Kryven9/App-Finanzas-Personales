import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"

export default [
    js.configs.recommended,
    {
        files: ["src/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                process: "readonly",
                console: "readonly",
                __dirname: "readonly",
            },
        },
        rules: {
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_"}],
            "no-console": "off",
        },
    },
    { ignores: ["node_modules/**", "dist/**", "coverage/**", "src/generated/prisma"]},
    eslintConfigPrettier
]