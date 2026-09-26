import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylistic from '@stylistic/eslint-plugin';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),

        {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                'React': 'readonly',
                'LayoutProps': 'readonly',
                'NextPage': 'readonly',
                'NextPageWithLayout': 'readonly',
                'AppProps': 'readonly',
                'AppPropsWithLayout': 'readonly',
                'DocumentProps': 'readonly',
                'DocumentContext': 'readonly',
                'DocumentInitialProps': 'readonly',
                'NextApiRequest': 'readonly',
                'NextApiResponse': 'readonly',
                'NextApiHandler': 'readonly'
            }
        }
    },

    {
        files: ["**/*.{ts,tsx}"],
        rules: {
            'no-undef': 'error',
            'no-redeclare': 'error',
            'no-dupe-class-members': 'error',
            'no-constant-condition': 'warn',
            'array-callback-return': 'error',
            'for-direction': 'error',
            'getter-return': 'error',
            'no-async-promise-executor': 'error',
            'no-class-assign': 'error',
            'no-compare-neg-zero': 'error',
            'no-cond-assign': 'error',
            'no-const-assign': 'error',
            'no-debugger': 'warn',
            'no-dupe-args': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
            'no-empty-character-class': 'error',
            'no-empty-pattern': 'error',
            'no-ex-assign': 'error',
            'no-fallthrough': 'warn',
            'no-func-assign': 'error',
            'no-import-assign': 'error',
            'no-inner-declarations': 'warn',
            'no-invalid-regexp': 'warn',
            'no-irregular-whitespace': 'error',
            'no-loss-of-precision': 'warn',
            'no-misleading-character-class': 'error',
            'no-new-native-nonconstructor': 'error',
            'no-obj-calls': 'error',
            'no-promise-executor-return': 'error',
            'no-prototype-builtins': 'warn',
            'no-self-assign': 'warn',
            'no-self-compare': 'error',
            'no-setter-return': 'error',
            'no-sparse-arrays': 'warn',
            'no-template-curly-in-string': 'warn',
            'no-this-before-super': 'error',
            'no-unassigned-vars': 'error',
            'no-unexpected-multiline': 'warn',
            'no-unmodified-loop-condition': 'warn',
            'no-unreachable': 'error',
            'no-unreachable-loop': 'warn',
            'no-unsafe-finally': 'warn',
            'no-unsafe-negation': 'error',
            'no-unsafe-optional-chaining': 'warn',
            'no-unused-private-class-members': 'warn',
            // 'no-unused-vars': ['warn', { args: 'none' }],
            'no-useless-assignment': 'warn',
            'no-useless-backreference': 'warn',
            'use-isnan': 'error',
            'valid-typeof': 'warn',

            'curly': ['error', 'multi-or-nest', 'consistent'],
            'eqeqeq': ['error', 'always'],
            'no-implied-eval': 'error',
            'no-with': 'error',

            'no-var': 'error',
            'prefer-const': 'warn',
            'object-shorthand': ['warn', 'always'],

            'no-nested-ternary': 'error',

            'max-len': ['warn', {
                code: 120,
                ignoreComments: false,
                ignoreStrings: false,
                ignoreTemplateLiterals: false
            }],

            // Classes
            'constructor-super': 'error',
            'no-useless-constructor': 'warn',
            'class-methods-use-this': 'off'
        }
    },

    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            '@stylistic': stylistic,
        },
        rules : {
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single', {
                allowTemplateLiterals: 'always'
            }],
            '@stylistic/indent': ['error', 4, {
                CallExpression: {
                    arguments: 'first'
                },
                ArrayExpression: 'first'
            }],
            '@stylistic/brace-style': ['error', '1tbs', {
                allowSingleLine: true
            }],
            '@stylistic/operator-linebreak': ['warn', 'before'],
            '@stylistic/comma-dangle': 'off'
        }
    }
]);

export default eslintConfig;
