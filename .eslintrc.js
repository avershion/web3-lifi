module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["plugin:@typescript-eslint/recommended", "prettier"],
    rules: {
        semi: ["error", "always"],
        "@typescript-eslint/no-unused-vars": ["error"],
    },
};
