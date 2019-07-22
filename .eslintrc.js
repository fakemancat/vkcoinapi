module.exports = {
    'env': {
        'es6': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module',
    },
    'rules': {
        'no-console': 0,
        'eqeqeq': 'error',
        'prefer-const': 0,
        'no-undef': 'warn',
        'no-empty': 'error',
        'linebreak-style': 0,
        'indent': ['error', 4],
        'no-undefined': 'error',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'dot-notation': 'error',
        'no-extra-semi': 'error',
        'no-unused-vars': 'error',
        'semi': ['error', 'always'],
        'block-scoped-var': 'error',
        'quotes': ['error', 'single'],
        'no-use-before-define': 'error',
        'dot-location': ['error', 'property'],
    }
};