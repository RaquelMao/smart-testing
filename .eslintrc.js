module.exports = {
    "extends": "airbnb-base",
    "parser": 'babel-eslint',
    'rules': {
        'global-require': 0,
        'import/no-unresolved': 0,
        'no-param-reassign': 0,
        'no-shadow': 0,
        'import/extensions': 0,
        'import/newline-after-import': 0,
        'no-multi-assign': 0,
        'no-unused-expressions': ['error', { 'allowTernary': true }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    },
    "plugins": ["jest"],
    "env": {
        "jest/globals": true
    }
};
