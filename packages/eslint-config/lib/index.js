module.exports = {
  env: {
    es6: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "import",
    "jsdoc"
  ],
  extends: ["airbnb-base"],
  ignorePatterns: [
    "**/node_modules",
    "**/dist",
    "**/docs"
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    },
    jsdoc: {
      maxLines: 2,
      preferredTypes: {
        String: "string",
        Boolean: "boolean",
        Number: "number",
        date: "Date",
        regexp: "RegExp",
        array: "Array",
        Function: "function",
        object: "object",
        Object: "object"
      }
    }
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module"
  },
  overrides: [{
    files: ["*.d.ts"],
    rules: {
      "max-classes-per-file": "off",
      "max-len": "off",
      "no-use-before-define": "off",
      "no-unused-vars": "off"
    }
  }, {
    files: ["*.ts"],
    rules: {
      "no-shadow": "off",
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": ["error"],
      "@typescript-eslint/no-shadow": ["error"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  }],
  rules: {
    "arrow-parens": "off",
    camelcase: "off",
    "eol-last": ["error", "always"],
    eqeqeq: ["error", "allow-null"],
    "comma-dangle": ["error", "never"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/scripts/**",
          "**/test/**",
          "**/*.test.jsx",
          "**/*.test.tsx",
          "**/*.test.js",
          "**/*.test.ts",
          "**/.eslintrc.js",
          "**/babel.config.js"
        ],
        optionalDependencies: false,
        peerDependencies: false
      }
    ],
    "import/prefer-default-export": "off",
    indent: ["error", 2, { SwitchCase: 1 }],
    "jsdoc/check-alignment": "error",
    "jsdoc/check-param-names": [
      "error",
      {
        checkDestructured: false
      }
    ],
    "jsdoc/check-syntax": "error",
    "jsdoc/check-tag-names": [
      "warn",
      {
        definedTags: ["swagger"]
      }
    ],
    "jsdoc/check-types": "error",
    "jsdoc/implements-on-classes": "error",
    "jsdoc/no-undefined-types": "error",
    "jsdoc/require-description": "error",
    "jsdoc/require-jsdoc": "error",
    "jsdoc/require-param": [
      "warn",
      {
        checkRestProperty: false,
        enableRestElementFixer: false
      }
    ],
    "jsdoc/require-param-description": "error",
    "jsdoc/require-param-name": "error",
    "jsdoc/require-param-type": "error",
    "jsdoc/require-returns": "error",
    "jsdoc/require-returns-check": "error",
    "jsdoc/require-returns-description": "error",
    "jsdoc/require-returns-type": "error",
    "jsdoc/valid-types": "error",
    "lines-between-class-members": "off",
    "linebreak-style": ["error", "unix"],
    "max-len": [
      "error",
      120,
      {
        ignoreComments: true
      }
    ],
    "new-cap": "error",
    "newline-before-return": "off",
    "no-await-in-loop": "off",
    "no-console": "error",
    "no-else-return": [
      "error",
      {
        allowElseIf: true
      }
    ],
    "no-eval": "error",
    "no-multiple-empty-lines": "off",
    "no-nested-ternary": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],
    "no-trailing-spaces": [
      "error",
      {
        skipBlankLines: true
      }
    ],
    "no-mixed-spaces-and-tabs": "error",
    "no-plusplus": "off",
    "no-undef": "error",
    "no-underscore-dangle": "off",
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }
    ],
    "no-warning-comments": "off",
    "object-curly-newline": "off",
    "object-curly-spacing": "off",
    "object-shorthand": ["error", "properties"],
    "one-var": "off",
    quotes: ["error", "double"],
    semi: ["error", "never"],
    "semi-spacing": "error",
    "space-before-function-paren": [
      "error",
      {
        anonymous: "never",
        named: "never",
        asyncArrow: "always"
      }
    ],
    "space-before-blocks": ["error", "always"],
    "space-infix-ops": "error",
    "valid-typeof": "off"
  }
}
