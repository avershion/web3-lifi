import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends(
        "next/core-web-vitals",
        "next/typescript",
        "plugin:jest/recommended",
        "plugin:jest/style"
    ),
    {
        plugins: ["jest"],
        env: {
            "jest/globals": true,
        },
        rules: {
            "jest/no-disabled-tests": "warn",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/prefer-to-have-length": "warn",
            "jest/valid-expect": "error",
        },
    },
];

export default eslintConfig;
